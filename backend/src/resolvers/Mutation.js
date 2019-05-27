const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const createToken = id => {
  return jwt.sign({ userId: id }, process.env.APP_SECRET);
};

const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // Take the copy of the updates
    const updates = { ...args };

    // Remove the ID from the updates
    delete updates.id;

    // Run the update method
    // Where id === args.id
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      // This 'info' is the item that will be returned to the client
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // Find the item
    const item = await ctx.db.query.item({ where }, '{id title}');

    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    // Hash their password
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // Create JWT
    const token = createToken(user.id);

    // Set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // Return the user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // Check if there is user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) throw new Error('No such user found for ' + email);

    // Check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password!');

    // Generate jwt token
    const token = createToken(user.id);

    // Set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // Return the user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },

  async requestReset(parent, { email }, ctx, info) {
    // Check if real user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) throw new Error(`No such user found with email ${email}`);

    // Set reset token expiry
    // Promisify enables to use randomBytes asynchronously
    const randomBytesPromisified = promisify(randomBytes);

    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // console.log('res', res);
    return { message: 'thanks' };

    // Email them the reset token
  },

  async resetPassword(parent, { password, confirmPassword, resetToken }, ctx, info) {
    // Check if passwords match
    if (password !== confirmPassword) throw new Error(`Passwords don't match`);

    // Check if token is expired
    const [user] = await ctx.db.query.users({
      where: {
        resetTokenExpiry_gte: Date.now() - 3600000,
        resetToken,
      },
    });
    if (!user) throw new Error(`Invalid or expired reset token`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new password and remove reset token
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // Generate JWT
    const token = createToken(updatedUser.id);

    // Set JWT Cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    // Return the new user
    return updatedUser;
  },

  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   const newDog = { name: args.name };
  //   global.dogs.push(newDog);
  //   console.log(args);
  // },
};

module.exports = Mutations;

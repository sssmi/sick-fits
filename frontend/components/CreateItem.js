import { Component, useState } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

function CreateItem(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [largeImage, setLargeImage] = useState('');
  const [price, setPrice] = useState(0);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value, 10) : value;

    if (name === 'title') setTitle(val);
    else if (name === 'description') setDescription(val);
    else setPrice(val);
  };
  return (
    <Mutation
      mutation={CREATE_ITEM_MUTATION}
      variables={{
        title,
        description,
        image,
        largeImage,
        price,
      }}
    >
      {(createItem, { loading, error }) => (
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await createItem();
            console.log('res', res);
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id },
            });
          }}
        >
          <ErrorMessage error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                value={title}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="price">
              Price
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                value={price}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="description">
              Description
              <textarea
                type="text"
                id="description"
                name="description"
                placeholder="Enter A Description"
                value={description}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Submit </button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
}

export { CREATE_ITEM_MUTATION };
export default CreateItem;

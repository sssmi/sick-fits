import { Component, useState } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

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
    else if (name === 'image') setImage(val);
    else if (name === 'largeImage') setLargeImage(val);
    else setPrice(val);
  };
  return (
    <Form>
      <fieldset>
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
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            value={description}
            onChange={handleChange}
            required
          />
        </label>
      </fieldset>
    </Form>
  );
}

export default CreateItem;

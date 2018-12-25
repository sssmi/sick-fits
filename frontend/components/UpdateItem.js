import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
    updateItem(id: $id, title: $title, description: $description, price: $price) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value, 10) : value;

    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    await updateItemMutation({
      variables: { id: this.props.id, ...this.state },
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>loading...</p>;
          if (!data.item) return <p>No item found for id: {this.props.id}</p>;
          return (
            <Mutation
              mutation={UPDATE_ITEM_MUTATION}
              variables={{
                title: this.state.title,
                description: this.state.description,
                price: this.state.price,
              }}
            >
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
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
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
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
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <button type="submit">Submit </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export { UPDATE_ITEM_MUTATION };
export default UpdateItem;

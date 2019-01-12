import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';
import { log } from 'util';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($first: Int = ${perPage}, $skip: Int = 0) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
`;

class Items extends React.Component {
  render() {
    const { page } = this.props;

    return (
      <Center>
        <Pagination page={page} />
        <Query query={ALL_ITEMS_QUERY} variables={{ skip: page * perPage - perPage }}>
          {({ data, error, loading }) => {
            if (loading) return <p>loading</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <ItemsList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemsList>
            );
          }}
        </Query>
        <Pagination page={page} />
      </Center>
    );
  }
}

export { ALL_ITEMS_QUERY };
export default Items;

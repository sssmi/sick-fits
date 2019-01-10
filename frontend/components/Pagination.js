import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

class Pagination extends Component {
  render() {
    return (
      <Query query={PAGINATION_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>loading..</p>;
          const { count } = data.itemsConnection.aggregate;
          const pages = Math.ceil(count / perPage);
          const { page } = this.props;
          return (
            <PaginationStyles>
              <Head>
                <title>
                  Sick Fits! – Page {page} of {pages}
                </title>
              </Head>
              <Link prefetch href={{ pathname: 'items', query: { page: page - 1 } }}>
                <a aria-disabled={page <= 1}>Prev</a>
              </Link>
              <p>
                Page {page} of {pages}
              </p>
              <p>{count} Items total!</p>
              <Link prefetch href={{ pathname: 'items', query: { page: page + 1 } }}>
                <a aria-disabled={page >= pages}>Next</a>
              </Link>
            </PaginationStyles>
          );
        }}
      </Query>
    );
  }
}

export default Pagination;

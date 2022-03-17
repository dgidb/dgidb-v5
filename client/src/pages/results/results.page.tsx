import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { request, gql, GraphQLClient } from 'graphql-request';
import SearchBar from '../../components/searchbar/SearchBar.component';
import { useGetInteractions } from '../../api/hooks/interactions/useGetInteractions';

import { FilterOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import { Button, Select, Form, Popover, Card, Table, Tag } from 'antd';
import 'antd/dist/antd.css';

import './results.page.scss';

const graphQLClient = new GraphQLClient('http://127.0.0.1:3000/api/graphql');

export const Results: React.FC = () => {

	const { data, error, isLoading, isError, isFetching } = useGetInteractions('5c60a645-e13e-4236-8aaf-5879bd44993e');

	return (
    <>

    </>
  )
};

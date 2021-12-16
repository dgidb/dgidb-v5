import React, { useState, useEffect} from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../components/searchbar/SearchBar.component';
import { useGetInteractions } from '../../hooks/interactions/useGetInteractions';

import {FilterOutlined} from '@ant-design/icons'

import 'antd/dist/antd.css';
import { Button, Select, Form, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";

import './home.page.scss';



export const Results: React.FC = () => {

  const {data} = useGetInteractions('5c60a645-e13e-4236-8aaf-5879bd44993e');

  console.log('data');
  console.log(data);

  return (
    <div>
      Results
    </div>

  )
}
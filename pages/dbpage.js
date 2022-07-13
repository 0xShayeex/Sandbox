import clientPromise from "../utils/mongodb";
import Navbar from '../components/landing/navbar'

/* eslint-disable react/jsx-key */
import React from 'react';
import useSWR from 'swr'
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useState } from 'react/cjs/react.production.min';


const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home({ joblist }) {
  return (
    
    <div className="container">
      <Navbar />
      <div>
        {joblist.map((job, index) => {
          return (
            <div className="card" key={index}>
              <h2>{job.title}</h2>
              <p>{job.role}</p>
              <p>{job.budget}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = await clientPromise;

  const db = client.db("dejobs");

  let joblist = await db.collection("joblist").find({}).toArray();
  joblist = JSON.parse(JSON.stringify(joblist));

  return {
    props: { joblist },
  };
}
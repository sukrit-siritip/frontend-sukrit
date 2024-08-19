'use client';
import React, { useState } from 'react';
import '@/styles.css';
import TableComponent from '@/components/TableComponent';
import { Input } from 'antd';

const Home = () => {
  const [searchValues, setSearchValues] = useState({
    technician: '',
    requestType: '',
    sapModule: '',
    customer: ''
  });

  return (
    <div>
      <div>
        <h1 className="headerfontstyle">Ticket Evolution</h1>
        <div className='container'>

          <div className='row'>
            <div className='column'>
              <h3>Technician:</h3>
              <Input type="text" value={searchValues.technician} onChange={(e) => setSearchValues({ ...searchValues, technician: e.target.value })} />
            </div>

            <div className="divider" />

            <div className='column'>
              <h3>SAP Module:</h3>
              <Input type="text" value={searchValues.sapModule} onChange={(e) => setSearchValues({ ...searchValues, sapModule: e.target.value })} />
            </div>
          </div>


          <div className='row'>
            <div className='column'>
              <h3>Request Type:</h3>
              <Input type="text" value={searchValues.requestType} onChange={(e) => setSearchValues({ ...searchValues, requestType: e.target.value })} />
            </div>


            <div className="divider" />

            <div className='column'>
              <h3>Customer:</h3>
              <Input type="text" value={searchValues.customer} onChange={(e) => setSearchValues({ ...searchValues, customer: e.target.value })} />
            </div>
          </div>

<br></br>
        </div>
        <TableComponent 
          filePath="TicketEvolution.xlsx"
          searchValues={searchValues}
        />
      </div>
    </div>
  );
};

export default Home;
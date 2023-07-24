import React, { useState } from 'react';
import CmnObjL from './cmnObjL';
import CmnObjTreeL from './cmnObjTreeL';

const containerStyle = {
  display: 'flex',
  gap: '20px', // Opciono - postavlja razmak između leve i desne komponente
};

const leftStyle = {
  flex: '2', // Opciono - podešava da obe komponente zauzimaju podjednak prostor
};

const rightStyle = {
  flex: '3', // Opciono - podešava da obe komponente zauzimaju podjednak prostor
};

export default function CombinedComponent() {
  const [sharedVariable, setSharedVariable] = useState({
    obj1: '',
    nobj1: '',
    obj2: '',
    nobj2: '',
    action: '',
  });

  return (
    <>
     <div className="grid">
     <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-2">
              <p>Obj1: {sharedVariable.obj1}</p>
            </div>
            <div className="field col-12 md:col-2">
              <p>Nobj1: {sharedVariable.nobj1}</p>
            </div>
            <div className="field col-12 md:col-2">
              <p>Obj2: {sharedVariable.obj2}</p>
            </div>
            <div className="field col-12 md:col-2">
              <p>Nobj2: {sharedVariable.nobj2}</p>
            </div>
            <div className="field col-12 md:col-2">
              <p>Action: {sharedVariable.action}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div style={containerStyle}>

        <div style={leftStyle}>
          <CmnObjL sharedVariable={sharedVariable} setSharedVariable={setSharedVariable} />
        </div>
        <div style={rightStyle}>
          <CmnObjTreeL sharedVariable={sharedVariable} setSharedVariable={setSharedVariable} />
        </div>

      </div>
    </>
  );
}

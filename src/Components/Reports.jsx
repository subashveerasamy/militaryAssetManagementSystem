import React, { useContext, useEffect, useState } from 'react'
import BaseContext from '../Context/BaseContext'
import UserContext from '../Context/UserContext';
import axios from 'axios';

const Reports = () => {
  const { base, setBase } = useContext(BaseContext);
  const { user, setUser } = useContext(UserContext);
  const [approval, setApproval] = useState();
  const [key, setKey] = useState();
  const [selectedData, setSelectedData] = useState(null);
  const [remarkBtn, setRemarkBtn] = useState();
  const [itemBtn, setItemBtn] = useState();
  const [remarks, setRemarks] = useState();

  useEffect(() => {
    if (approval && selectedData && key) {
      handleReqAp(selectedData);
    }
  }, [approval, selectedData, key]);




  const [transaction, setTransaction] = useState([]);
  useEffect(() => {
    setTransaction(base.transaction);
  }, [base.transaction]);
  console.log(transaction)

  const handleReqAp = (data) => {
    const reqApp = async (data) => {
      const response = await axios.put("https://military-asset-be.onrender.com/base/updatetransactionfromrequesting", {
        id: data._id,
        requesting_base: data.requesting_base,
        receiving_base: data.receiving_base,
        [key]: approval,
        basename: user.base,
        remarks
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      })
      if (response.data.base) {
        setBase(response.data.base);
      }
    }
    reqApp(data);
  }

  return (
    <div className='d-flex justify-content-evenly align-items-center' >
      <table className='custom-table' style={{ tableLayout: "fixed", width: "100vw" }}>
        <thead>
          <tr>
            <th id='id' style={{ width: "100px", overflow: "hidden" }} >Id</th>
            <th style={{ width: "100px" }} >From</th>
            <th style={{ width: "100px" }} >To</th>
            <th style={{ width: "100px" }} >Initiator</th>
            <th style={{ width: "100px" }} >Movement</th>
            <th style={{ width: "100px" }} >From Approval</th>
            <th style={{ width: "100px" }} >To Approval</th>
            <th style={{ width: "100px" }} >Approved Date</th>
            <th style={{ width: "100px" }} >Initiation Date</th>
            <th style={{ width: "100px" }} >Completion Date</th>
            <th style={{ width: "100px" }} >Item Details</th>
            <th style={{ width: "100px" }} >Remarks</th>
            <th style={{ width: "100px" }} >Status</th>
          </tr>
        </thead>
        <tbody>
          {
            transaction.length > 0 ? (transaction.slice().reverse().map((data, index) => (
              <tr key={index}>
                <td className='reportsId' style={{ overflow: "hidden" }}>{data._id}</td>
                <td>{data.requesting_base}</td>
                <td>{data.receiving_base}</td>
                <td>{data.initiator}</td>
                <td>{data.movement_type}</td>
                <td>{((user.role === "base_commander" && user.base === data.requesting_base) || user.role === "admin") && (data.requesting_base_approval === "yet to approve") ? (
                  <button className='btn btn-success' onClick={() => { setSelectedData(data); setApproval("approved"); setKey("requesting_base_approval") }}> approve</button>
                ) : ((user.role === "base_commander" && user.base === data.requesting_base) || user.role === "admin") && (data.requesting_base_approval === "approved" && data.receiving_base_approval === "yet to approve" && data.status !== "completed") ? (
                  <button className='btn btn-danger' onClick={() => { setSelectedData(data); setApproval("cancelled"); setKey("requesting_base_approval") }}> Cancel</button>
                ) :
                  data.requesting_base_approval}</td>
                <td>{((user.role === "base_commander" && user.base === data.receiving_base) || user.role === "admin") && (data.receiving_base_approval === "yet to approve" && data.requesting_base_approval === "approved" && data.movement_type !== "purchase") ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className='mx-1'><button className='btn btn-success' onClick={() => {
                      if (remarks) {
                        setSelectedData(data); setApproval("approved"); setKey("receiving_base_approval")
                      }
                      else {
                        alert("Please Give remarks");
                      }
                    }}> A</button></div>
                    <div><button className='btn btn-danger' onClick={() => {
                      if (remarks) {
                        setSelectedData(data); setApproval("rejected"); setKey("receiving_base_approval")
                      }
                      else {
                        alert("Please Give remarks");
                      }
                    }}>R</button></div>

                  </div>
                ) :
                  data.receiving_base_approval}</td>
                <td>{data.approved_date}</td>
                <td>{(data.movement_type === "transfer out" || user.role === 'admin') && data.receiving_base_approval === 'approved' && data.initiation_date === "-" ? (
                  <div> <button className='btn btn-success' onClick={() => { setSelectedData(data); setApproval(new Date().toISOString().split("T")[0]); setKey("initiation_date") }}> initiate</button>
                  </div>
                ) :
                  data.initiation_date}</td>
                <td>{(data.movement_type === "transfer in" || user.role === "admin") && data.initiation_date !== "-" && data.completion_date === "-" ? (
                  <div> <button className='btn btn-success' onClick={() => { setSelectedData(data); setApproval(new Date().toISOString().split("T")[0]); setKey("completion_date") }}> Complete</button>
                  </div>
                ) :
                  data.completion_date}</td>
                <td className='reportsItem' style={{ cursor: "pointer" }}>

                  <p className='reportsItem' onClick={() => { setSelectedData(data); setItemBtn(true) }}>
                    {data.item_details.map(item => `${item.specific_name} - ${item.quantity} Nos`).join(", ")}
                  </p>
                </td>
                <td>{((!data.remarks && data.receiving_base_approval !== "approved" && data.requesting_base_approval !== "cancelled") && (user.base === data.receiving_base || user.role === "admin") && (user.role !== "logistics_officer")) ? (
                  <button className="btn btn-warning" onClick={() => { setSelectedData(data); setRemarkBtn(true) }}>Remarks</button>
                ) : data.remarks}</td>
                <td>{data.status}</td>
              </tr>
            )

            )) : null
          }
        </tbody>

      </table>
      {itemBtn && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",  // Semi-transparent dark overlay
          backdropFilter: "blur(5px)",   // Applies blur effect

          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }} onClick={() => setRemarkBtn(false)}>

          <div style={{
            background: "white",
            padding: "20px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            borderRadius: "8px"
          }} onClick={(e) => e.stopPropagation()}>

            {selectedData.item_details.map((item, index) => (
              <p key={index}>{item.specific_name} - {item.quantity} Nos</p>

            ))}
            <div className="mt-2 d-flex justify-content-center align-items-center">
              <button className="p-2 btn btn-danger" onClick={() => setItemBtn(false)}>Close</button>
            </div>
          </div>

        </div>
      )}
      {remarkBtn && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(5px)",

          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }} onClick={() => setRemarkBtn(false)}>

          <div style={{
            background: "#5A9C73",
            padding: "20px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            borderRadius: "8px"
          }} onClick={(e) => e.stopPropagation()}>
            <div>Enter Remarks :</div>
            <div className="p-3">
              <textarea name="remark" onChange={(e) => setRemarks(e.target.value)} className="form-control"></textarea>

            </div>
            <div className="mt-2 d-flex justify-content-around align-items-center">
              <div><button className="p-2 btn btn-danger" onClick={() => { setRemarkBtn(false); setRemarks() }}>Close</button></div>
              <div><button className="p-2 btn btn-success" onClick={() => setRemarkBtn(false)}>Submit</button></div>
            </div>
          </div>

        </div>
      )}



    </div>



  )
}

export default Reports
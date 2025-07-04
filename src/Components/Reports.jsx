import React, { useContext, useEffect, useState } from 'react'
import BaseContext from '../Context/BaseContext'
import UserContext from '../Context/UserContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import dayjs from 'dayjs';
import BaseDataContext from '../Context/BaseDataContext';
import currentBaseContext from '../Context/CurrentBaseContect';
const Reports = () => {
  const { base, setBase } = useContext(BaseContext);
  const { user, setUser } = useContext(UserContext);
  const { fetchBase, setFetchBase } = useContext(BaseDataContext);
  const [remarkBtn, setRemarkBtn] = useState();
  const [selectedData, setSelectedData] = useState();
  const [itemBtn, setItemBtn] = useState();
  const [remarks, setRemarks] = useState();
  const [filter, setFilter] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [selectedToDate, setSelectedToDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const { selectBase, setSelectBase } = useContext(currentBaseContext);

  const [filterData, setFilterData] = useState({
    from: [],
    to: [],
    movement: [],
    fromApproval: [],
    toApproval: [],
    initiationDate: [],
    completionDate: [],
    status: []
  });
  const baseNames = user.role === 'admin' ? ([
    'Fort Titan', 'Echo Command', 'Sentinel Base', 'Ironclad Depot', 'Vanguard Station',
    'Guardian Outpost', 'Shadow Ridge', 'Falcon Fortress', 'Phoenix Armory', 'Havoc Point',
    'Redhawk Barracks', 'Thunderhold Base', 'Stormwatch HQ', 'Silver Spear Depot', 'Raven Rock Command',
    'Warhound Keep', 'Crossfire Station', 'Blackstone Bunker', 'Delta Sentinel', 'Legion Hold',
    'Cerberus Outpost', 'Fort Resolute', 'Ironwing Command', 'Helix Forward Base', 'Striker Point'
  ]) : [user.base];
  const baseNamesFilter = [
    'Fort Titan', 'Echo Command', 'Sentinel Base', 'Ironclad Depot', 'Vanguard Station',
    'Guardian Outpost', 'Shadow Ridge', 'Falcon Fortress', 'Phoenix Armory', 'Havoc Point',
    'Redhawk Barracks', 'Thunderhold Base', 'Stormwatch HQ', 'Silver Spear Depot', 'Raven Rock Command',
    'Warhound Keep', 'Crossfire Station', 'Blackstone Bunker', 'Delta Sentinel', 'Legion Hold',
    'Cerberus Outpost', 'Fort Resolute', 'Ironwing Command', 'Helix Forward Base', 'Striker Point'
  ];
  const handleChange = (event) => {
    setSelectBase(event.target.value);

  };
  useEffect(() => {
    const baseObj = user.role === "admin" ? fetchBase.find(item => item.basename === selectBase) : fetchBase;
    if (baseObj !== base) {
      setBase(baseObj || null);
    }
  }, [selectBase])
  const [selectedFilter, setSelectedFilter] = useState('from');
  const filterObject = {
    from: baseNamesFilter,
    to: baseNamesFilter,
    movement: ["transfer in", "transfer out", "purchase"],
    fromApproval: ["approved", "yet to approve", "cancelled"],
    toApproval: ["approved", "yet to approve", "rejected"],
    status: ["completed", "yet to approve", "cancelled", "rejected", "initiated", "approved"]

  }
  const handleCheckBox = (category, value, ischecked) => {
    setFilterData((prevData) => ({
      ...prevData,
      [category]: ischecked ? [...prevData[category], value] : prevData[category].filter(item => item !== value)

    }))

  }
  const handleFilterDate = (category, fromDate, toDate, isChecked) => {
    setFilterData((prevData) => ({
      ...prevData,
      [category]: isChecked
        ? [fromDate, toDate]
        : []
    }));

  };
  useEffect(() => {
    console.log("Updated filterData:", filterData);
  }, [filterData]);

  useEffect(() => {
    console.log(selectedData);
  }, [selectedData])




  const [transaction, setTransaction] = useState([]);
  useEffect(() => {
    setTransaction(base.transaction);

  }, [base.transaction]);

  const handleFilter = () => {
    const filterResult = base.transaction.filter((item) =>
      (!filterData.from.length || filterData.from.includes(item.requesting_base)) &&
      (!filterData.to.length || filterData.to.includes(item.receiving_base)) &&
      (!filterData.movement.length || filterData.movement.includes(item.movement_type)) &&
      (!filterData.status.length || filterData.status.includes(item.status)) &&
      (!filterData.fromApproval.length || filterData.fromApproval.includes(item.requesting_base_approval)) &&
      (!filterData.toApproval.length || filterData.toApproval.includes(item.receiving_base_approval)) &&
      (!filterData.initiationDate.length ||
        (item.initiation_date >= filterData.initiationDate[0] && item.initiation_date <= filterData.initiationDate[1])) &&
      (!filterData.completionDate.length ||
        (item.completion_date >= filterData.completionDate[0] && item.completion_date <= filterData.completionDate[1]))
    );

    setTransaction(filterResult);
  };
  useEffect(() => {
    console.log("Transaction data before filtering:", transaction);
  }, [transaction]);

  const defaultDate = dayjs().format("YYYY-MM-DD");


  const handleReqAp = (data, approval, key) => {
    const reqApp = async () => {
      const response = await axios.put("https://military-asset-be.onrender.com/base/updatetransactionfromrequesting", {
        id: data._id,
        requesting_base: data.requesting_base,
        receiving_base: data.receiving_base,
        [key]: approval,
        basename: base.basename,
        remarks
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      })
      if (response.data.base) {
        setBase(response.data.base);
        setFetchBase(fetchBase.map((it) => {
          if (it.basename === base.basename) {
            return response.data.base
          }
          else {
            return it
          }
        }))
      }
      if (response.data.message === "insufficient arms") {
        alert("insufficient arms");
      }
    }
    reqApp(data, approval, key);
  }

  return (
    <div className='' >

      <div className='m-3 d-flex justify-content-around align-items-center'>
        <div className='m-3 d-flex justify-content-around align-items-center'>
          <div style={{ width: "100px" }}>Base Name :</div>
          <div style={{ minWidth: "250px", maxWidth: "30vw" }}>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id="base-select-label">Select Base</InputLabel>
                <Select
                  labelId="base-select-label"
                  id="base-select"
                  value={selectBase}
                  label="Select Base"
                  onChange={handleChange}
                >
                  {baseNames.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

          </div>
        </div>
        <div className="btn btn-warning m-3" onClick={() => setFilter(true)}>
          <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faFilter} />
          Filter</div>
      </div>
      <div className='d-flex justify-content-evenly align-items-center'>
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
                    <button className='btn btn-success' onClick={() => { handleReqAp(data, "approved", "requesting_base_approval") }}> approve</button>
                  ) : ((user.role === "base_commander" && user.base === data.requesting_base) || user.role === "admin") && (data.requesting_base_approval === "approved" && data.receiving_base_approval === "yet to approve" && data.status !== "completed") ? (
                    <button className='btn btn-danger' onClick={() => { handleReqAp(data, "cancelled", "requesting_base_approval") }}> Cancel</button>
                  ) :
                    data.requesting_base_approval}</td>
                  <td>{((user.role === "base_commander" && user.base === data.receiving_base) || user.role === "admin") && (data.receiving_base_approval === "yet to approve" && data.requesting_base_approval === "approved" && data.movement_type !== "purchase") ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <div className='mx-1'><button className='btn btn-success' onClick={() => {
                        if (remarks) {
                          handleReqAp(data, "approved", "receiving_base_approval")
                        }
                        else {
                          alert("Please Give remarks");
                        }
                      }}> A</button></div>
                      <div><button className='btn btn-danger' onClick={() => {
                        if (remarks) {
                          handleReqAp(data, "rejected", "receiving_base_approval")
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
                    <div> <button className='btn btn-success' onClick={() => { handleReqAp(data, new Date().toISOString().split("T")[0], "initiation_date") }}> initiate</button>
                    </div>
                  ) :
                    data.initiation_date}</td>
                  <td>{(data.movement_type === "transfer in" || user.role === "admin") && data.initiation_date !== "-" && data.completion_date === "-" ? (
                    <div> <button className='btn btn-success' onClick={() => { handleReqAp(data, new Date().toISOString().split("T")[0], "completion_date") }}> Complete</button>
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
      </div>
      {itemBtn && (
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
      {
        filter && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }} onClick={() => setFilter(false)}>

            <div style={{
              background: "#5A9C73",
              padding: "20px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
              borderRadius: "8px",
              height: "85vh",
              width: "600px"

            }} onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-center w-100 " style={{ maxHeight: "70vh", border: "2px solid black" }}>
                <div className='p-3 text-center w-50' style={{ background: "white", minHeight: "68vh", maxHeight: "70vh", borderRight: "2px solid black" }}>
                  <div className='p-2 ' onClick={() => setSelectedFilter('from')} style={{ background: selectedFilter === 'from' ? "#5A9C73" : null, borderRadius: "25px" }}>Req. Base</div>
                  <div className='p-2' onClick={() => setSelectedFilter('to')} style={{ background: selectedFilter === 'to' ? "#5A9C73" : null, borderRadius: "25px" }}>Rec. Base</div>
                  <div className='p-2' onClick={() => setSelectedFilter('fromApproval')} style={{ background: selectedFilter === 'fromApproval' ? "#5A9C73" : null, borderRadius: "25px" }}>From Approval</div>
                  <div className='p-2' onClick={() => setSelectedFilter('toApproval')} style={{ background: selectedFilter === 'toApproval' ? "#5A9C73" : null, borderRadius: "25px" }}>To Approval</div>
                  <div className='p-2' onClick={() => setSelectedFilter('movement')} style={{ background: selectedFilter === 'movement' ? "#5A9C73" : null, borderRadius: "25px" }}>Movement</div>
                  <div className='p-2' onClick={() => setSelectedFilter('initiationDate')} style={{ background: selectedFilter === 'initiationDate' ? "#5A9C73" : null, borderRadius: "25px" }}>Initiation Date</div>
                  <div className='p-2' onClick={() => setSelectedFilter('completionDate')} style={{ background: selectedFilter === 'completionDate' ? "#5A9C73" : null, borderRadius: "25px" }}>Completion Date</div>
                  <div className='p-2' onClick={() => setSelectedFilter('status')} style={{ background: selectedFilter === 'status' ? "#5A9C73" : null, borderRadius: "25px" }}>Status</div>
                </div>
                <div className='p-3 w-75' style={{ background: "white", minHeight: "68vh", maxHeight: "70vh", overflow: "scroll" }}>
                  {
                    (selectedFilter === 'initiationDate' || selectedFilter === 'completionDate') ? (
                      <div>
                        <div>
                          <input type="checkbox" checked={filterData[selectedFilter]?.length > 0 || false} onChange={(e) => handleFilterDate(selectedFilter, selectedFromDate, selectedToDate, e.target.checked)} />
                        </div>
                        <div>
                          <div>From :</div>
                          <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                calendars={1}
                                value={selectedFilter === 'initiationDate'
                                  ? dayjs(filterData.initiationDate[0] || defaultDate)
                                  : selectedFilter === 'completionDate'
                                    ? dayjs(filterData.completionDate[0] || defaultDate)
                                    : dayjs(defaultDate)}
                                onChange={(newValue) => {
                                  if (newValue) {
                                    const formattedDate = newValue.format("YYYY-MM-DD");
                                    const today = dayjs().format("YYYY-MM-DD");


                                    if (formattedDate <= today) {
                                      if (selectedFromDate <= selectedToDate) {
                                        setSelectedFromDate(formattedDate);
                                        handleFilterDate(selectedFilter, formattedDate, selectedToDate, true);
                                      }
                                      else {
                                        alert("From date cannot be greater than To date")
                                      }



                                    } else {
                                      alert("You cannot select a future date.");
                                    }

                                  }
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                        </div>
                        <div>
                          <div>To :</div>
                          <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                calendars={1}

                                value={selectedFilter === 'initiationDate'
                                  ? dayjs(filterData.initiationDate[1] || defaultDate)
                                  : selectedFilter === 'completionDate'
                                    ? dayjs(filterData.completionDate[1] || defaultDate)
                                    : dayjs(defaultDate)}
                                onChange={(newValue) => {
                                  if (newValue) {
                                    const formattedDate = newValue.format("YYYY-MM-DD");
                                    const today = dayjs().format("YYYY-MM-DD");


                                    if (formattedDate <= today) {
                                      setSelectedToDate(formattedDate);
                                      handleFilterDate(selectedFilter, selectedFromDate, formattedDate, true);

                                    } else {
                                      alert("You cannot select a future date.");
                                    }

                                  }
                                }}
                              />
                            </LocalizationProvider></div>
                        </div>
                      </div>
                    ) : (
                      filterObject[selectedFilter].map((data, index) => (
                        <div className='p-2' key={index}>
                          <input type="checkbox" checked={filterData[selectedFilter]?.includes(data) || false} onChange={(e) => handleCheckBox(selectedFilter, data, e.target.checked)} />
                          <label htmlFor="">{data}</label>
                        </div>
                      ))
                    )
                  }
                </div>
              </div>
              <div className="mt-2 d-flex justify-content-around align-items-center">
                <div><button className="p-2 btn btn-danger" onClick={() => { setFilter(false) }}>Close</button></div>
                <div><button className="p-2 btn btn-success" onClick={() => { setFilter(false); handleFilter() }}>Submit</button></div>
              </div>
            </div>

          </div>
        )

      }



    </div>



  )
}

export default Reports
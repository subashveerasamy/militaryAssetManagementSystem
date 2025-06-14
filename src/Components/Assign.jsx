import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import BaseContext from "../Context/BaseContext";
import UserContext from "../Context/UserContext";
import axios from "axios";
const arm_nameNames = [
  "Helicopter",
  "Rifle",
  "Ammo",
  "Grenade",
  "Tank",
  "Radar",
  "Jet_Fighter",
  "Aircraft_Carrier",
  "Missile_Launcher",
  "Submarine",
  "Body_Armor",
  "Artillery_Cannon",
  "Night_Vision_Goggles",
  "Drone",
  "Communication_System",
];

const assetNames = {
  Helicopter: [
    { image: "/AH64.jpg", title: "AH-64 Apache Helicopter", items: 5 },
    { image: "/ch47.jpeg", title: "CH-47 Chinook", items: 10 },
    { image: "/OH58.jpg", title: "OH-58 Kiowa", items: 500 }
  ],
  Rifle: [
    { image: "/M4.jpg", title: "M4 Carbine", items: 20 },
    { image: "/BM82.jpg", title: "Barrett M82", items: 3 },
    { image: "/HK417.jpg", title: "HK417", items: 2 }
  ],
  Ammo: [
    { image: "/M4 Ammo.jpg", title: "M4 Ammo (60 rounds)", items: 4 },
    { image: "/BM82 Ammo.jpg", title: "Barrett M82 Ammo (60 rounds)", items: 1 },
    { image: "/HK417 Ammo.jpg", title: "HK417 Ammo (60 rounds)", items: 3 }
  ],
  Grenade: [
    { image: "/Grenades.jpg", title: "Grenades (Explosive with shrapnel spread)", items: 2 }
  ],
  Tank: [
    { image: "/M1 Abrams.jpg", title: "M1 Abrams (Heavy armor & firePower)", items: 50 },
    { image: "/Stingray tank.jpg", title: "Stingray (Fast maneuverability)", items: 4 },
    { image: "/merkava tank.jpg", title: "Merkava (Hybrid combat & troop protection)", items: 15 }
  ],
  Radar: [
    { image: "/GBR.jpg", title: "Ground-Based Radar (Detects aerial threats)", items: 5 },
    { image: "/NBR.jpg", title: "Naval Radar System (Ship-based navigation & tracking)", items: 8 },
    { image: "/ABR.jpg", title: "Airborne Radar (Mounted on aircraft for aerial surveillance)", items: 5 }
  ],
  Jet_Fighter: [
    { image: "/F22.jpg", title: "F-22 Raptor (Undetectable radar signature)", items: 10 },
    { image: "/F16.jpg", title: "F-16 Fighting Falcon (Balanced agility & firepower)", items: 500 },
    { image: "/mig31.jpg", title: "MiG-31 (High-speed enemy pursuit)", items: 20 }
  ],
  Aircraft_Carrier: [
    { image: "/nimitz.jpg", title: "Nimitz-class (Massive deployment capabilities)", items: 3 },
    { image: "/invincible.jpg", title: "Invincible-class (Smaller, more flexible operations)", items: 2 },
    { image: "/wasp.jpg", title: "Wasp-class (Optimized for rotary aircraft)", items: 4 }
  ],
  Missile_Launcher: [
    { image: "/ICMB.jpg", title: "ICMB Platforms (Long-range warfare)", items: 1 },
    { image: "/tamahawk.jpg", title: "Tomahawk-equipped systems (Precision strikes)", items: 3 },
    { image: "/patriot.jpg", title: "Patriot System (Air defense)", items: 2 }
  ],
  Submarine: [
    { image: "/virginia.jpg", title: "Virginia-class (Stealth & underwater combat)", items: 50 },
    { image: "/ohio.jpg", title: "Ohio-class (Strategic nuclear deterrence)", items: 4 },
    { image: "/nr1.jpg", title: "NR-1 (Covert intelligence gathering)", items: 15 }
  ],
  Body_Armor: [
    { image: "/kevlar.jpg", title: "Kevlar-based torso protection", items: 5 },
    { image: "/Exoskeleton.jpg", title: "Exoskeleton Armor - Enhances soldier endurance", items: 8 },
    { image: "/riot gear.jpg", title: "Riot Gear Armor - Shields against melee attack", items: 5 }
  ],
  Artillery_Cannon: [
    { image: "/howitzer.jpg", title: "Howitzer - Long-range fire support", items: 10 },
    { image: "/rocket Artillery.jpg", title: "Rocket Artillery - Multiple rapid launches", items: 500 },
    { image: "/anti aircraft.jpg", title: "Anti-Aircraft Artillery - Defense against airborne threat", items: 20 }
  ],
  Night_Vision_Goggles: [
    { image: "/thermal goggles.jpg", title: "Thermal Goggles - Detects heat signatures", items: 3 },
    { image: "/infrared goggles.jpg", title: "Infrared Goggles - Enhances visibility in darkness", items: 2 }
  ],
  Drone: [
    { image: "/mq9.jpg", title: "MQ-9 Reaper (Surveillance & intelligence)", items: 4 },
    { image: "/xq58.jpg", title: "XQ-58 Valkyrie (Armed autonomous strike unit)", items: 1 }
  ],
  Communication_System: [
    { image: "/trs.jpg", title: "Tactical Radio System - Encrypted unit-level communication", items: 3 },
    { image: "/SCS.jpg", title: "Satellite Communication System - Global military relay", items: 2 },
    { image: "/mcn.jpg", title: "Mobile Command Network - Battlefield coordination interface", items: 50 }
  ]
};

const validationSchema = Yup.object().shape({
  arm_name: Yup.string().required("Asset Category is required"),
  specific_name: Yup.string().required("Specific Asset Name is required"),
  soldier_serial: Yup.number().required("Serial Number is required"),
  soldier_name: Yup.string().required("Person to Assign is required"),
  condition: Yup.string().required("Condition of Arms is required"),
  remarks: Yup.string(),
  quantity: Yup.number().required("Quantity is required"),

});

const Assign = () => {
  const { base, setBase } = useContext(BaseContext);
  const { user, setUser } = useContext(UserContext);
  const [expenditure, setExpenditure] = useState();
  const [reason, setReason] = useState('');
  const [serial, setSerial] = useState(0);
  const [assignedData, setAssignedData] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  useEffect(() => {
    console.log(assignedData)
  }, [assignedData, selectedData])


  return (
    <div className="assign" style={{backgroundImage:`url("/assignBg.jpg")`, backgroundRepeat:"no-repeat", backgroundSize:"cover"}}>
      <style>
    {`
      .assign {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        font-size: 15px;
      }
      @media (max-width: 1300px) {
        .assign {
          flex-wrap: wrap;
        }
      }
    `}
  </style>


      <Formik
        initialValues={{
          arm_name: "",
          specific_name: "",
          soldier_serial: "",
          soldier_name: "",
          quantity: 0,
          condition: "",
          remarks: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, {resetForm}) => {
          try {
            if (values.quantity > 0 && values.soldier_serial > 0) {
              const response = await axios.post("https://military-asset-be-1.onrender.com/base/assignarms", {
                arm_name: values.arm_name,
                specific_name: values.specific_name,
                soldier_serial: values.soldier_serial,
                soldier_name: values.soldier_name,
                quantity: values.quantity,
                condition: values.condition,
                assign_remarks: values.remarks,
                basename: user.base
              });

              console.log("Form Submitted Successfully:", response.data);
              resetForm();
            } else {
              if (values.quantity < 1) {
                alert("Set Quantity");
              }
              else {
                alert("Set Soldier Serial")
              }
            }
          } catch (error) {
            console.error("Error submitting form:", error);
          }
        }}
      >
        {({ values, handleChange, setFieldValue, errors, touched, handleSubmit }) => (
          <div className="d-flex justify-content-center w-100" >
            <Form onSubmit={handleSubmit} className=" m-5 text-light d-flex justify-content-center align-items-center p-4 w-50" style={{backdropFilter:"blur(3px)", border:"2px solid white", borderRadius:"25px"}}>

           

              <div >


                <h3 className="w-100">Assign Arms</h3>
                <div className="mb-4">
                  <label className="w-100">
                    Soldier Serial:
                    <input

                      type="number"
                      name="soldier_serial"
                      className="form-control" style={{ marginTop: "10px" }}
                      value={values.soldier_serial || 0}
                      onChange={(e) => {
                        const newValue = Math.max(0, Number(e.target.value) || 0);
                        handleChange(e);
                        setFieldValue("soldier_serial", newValue);
                      }}
                    />
                    {errors.soldier_serial && touched.soldier_serial ? (
                      <div style={{ color: "red" }}>{errors.soldier_serial}</div>
                    ) : null}
                  </label>
                </div>

                <div className="mb-4 w-100">
                  <label className="w-100">
                    Person to Assign:
                    <input type="text" name="soldier_name" className="form-control" style={{ marginTop: "10px" }}
                      value={values.soldier_name || ""}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("soldier_name", e.target.value);
                      }}
                    />
                    {errors.soldier_name && touched.soldier_name ? (
                      <div style={{ color: "red" }}>{errors.soldier_name}</div>
                    ) : null}
                  </label>
                </div>
                <div className="mb-4">
                  <label >
                    Arms Name :
                    <Box sx={{ minWidth: 250, marginTop: "10px" }}>
                      <FormControl fullWidth sx={{color:"white"}}>
                        <InputLabel sx={{color:"white"}}>Select Arms</InputLabel>
                        <Select
                          name="arm_name"
                          value={values.arm_name}
                          sx={{color:"white"}}
                          onChange={(event) => {
                            handleChange(event);
                            setFieldValue("specific_name", "");
                          }}
                        >
                          {arm_nameNames.map((name, index) => (
                            <MenuItem key={index} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.arm_name && touched.arm_name ? (
                          <div style={{ color: "red" }}>{errors.arm_name}</div>
                        ) : null}
                      </FormControl>
                    </Box>
                  </label>
                </div>

                <div className="mb-4">
                  <label >
                    Specific Name :
                    <Box sx={{ minWidth: 250, marginTop: "10px", color:"white" }}>
                      <FormControl fullWidth sx={{color:"white"}}>
                        <InputLabel sx={{color:"white"}}>Specify Arms</InputLabel>
                        <Select
                          name="specific_name"
                          value={values.specific_name}
                          onChange={handleChange}
                           sx={{color:"white"}}
                        >
                          {values.arm_name &&
                            assetNames[values.arm_name]?.map((name, index) => (
                              <MenuItem key={index} value={name.title}>
                                {name.title}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.specific_name && touched.specific_name ? (
                          <div style={{ color: "red" }}>{errors.specific_name}</div>
                        ) : null}
                      </FormControl>
                    </Box>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="w-100">
                    Quantity:
                    <input
                      type="number"
                      name="quantity"
                      className="form-control" style={{ marginTop: "10px" }}
                      value={values.quantity || 0}
                      onChange={(e) => {
                        const newValue = Math.max(0, Number(e.target.value) || 0);
                        handleChange(e);
                        setFieldValue("quantity", newValue);
                      }}

                    />
                    {errors.quantity && touched.quantity ? (
                      <div style={{ color: "red" }}>{errors.quantity}</div>
                    ) : null}
                  </label>
                </div>


                <div className="mb-4">
                  <label className="w-100">
                    Condition of Arms:
                    <input type="text" name="condition" className="form-control" style={{ marginTop: "10px" }}
                      value={values.condition || ""}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("condition", e.target.value);
                      }}
                    />
                    {errors.condition && touched.condition ? (
                      <div style={{ color: "red" }}>{errors.condition}</div>
                    ) : null}
                  </label>
                </div>

                <div className="mb-4">
                  <label className="w-100">
                    Remarks:
                    <input as="textarea" name="remarks" className="form-control" style={{ marginTop: "10px" }}
                      value={values.remarks || ""}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("remarks", e.target.value);
                      }}
                    />
                  </label>
                </div>

                <div className="d-flex justify-content-center align-items-center w-100">
                  <button className="btn btn-primary" type="submit" variant="contained" color="primary">
                    Submit
                  </button>
                </div>
              </div>
            </Form>
          </div>

        )}
      </Formik>

      <div className="d-flex justify-content-center w-100">
        <form className=" m-5  text-light d-flex justify-content-center align-items-center w-50" style={{backdropFilter:"blur(3px)", border:"2px solid white", borderRadius:"25px"}}>



          <div >


            <h3 className="w-100">Assign Arms</h3>

            <div className="mb-4">
              <label className="w-100">
                Soldier Serial:
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <input

                      type="number"
                      name="soldier_serial"
                      className="form-control" style={{ marginTop: "10px" }}
                      value={serial || ''}
                      onChange={(e) => {
                        setSerial(e.target.value);

                      }}
                      min={0}
                    />
                  </div>
                  <div className="ms-4">
                    <button className="btn btn-primary" onClick={(e) => {
                      e.preventDefault();
                      const getassigneddata = async () => {
                        const response = await axios.get("https://military-asset-be-1.onrender.com/base/getassigneddata", {
                          params: {
                            soldier_serial: serial,
                            basename: user.base
                          }

                        })
                        if (response.data.message === "Soldier Serial Not Found") {
                          return alert("Soldier Serial Not Found");
                        }
                        if (response.data.result) {
                          setAssignedData(response.data.result);
                        }


                      }
                      getassigneddata();
                    }}>Search</button>
                  </div>
                </div>


              </label>
            </div>



            <div className="mb-4 w-100">
              <label className="w-100">
                Person to Assign:
                <input type="text" name="soldier_name" className="form-control" style={{ marginTop: "10px" }}
                  value={assignedData?.[0]?.soldier_name || ""}
                  readOnly
                />

              </label>
            </div>
            

            <div className="mb-4">
              <label >
                Specific Name :
                <Box sx={{ minWidth: 250, marginTop: "10px" , color:"white"}}>
                  <FormControl fullWidth sx={{color:"white"}}>
                    <InputLabel sx={{color:"white"}}>Specify Arms</InputLabel>
                    <Select
  name="specific_name"
  sx={{
    width: "330px", 
    color: "white",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis", 
  }}
  value={selectedData?.specific_name || ""}
  onChange={(event) => {
    const selectedObject = assignedData.find(
      (item) => item.specific_name === event.target.value
    );
    setSelectedData(selectedObject);
  }}
>
  {assignedData.map((name, index) => (
    <MenuItem key={index} value={name.specific_name || ""} sx={{ maxWidth: "200px" }}>
      {name?.specific_name || ""}
    </MenuItem>
  ))}
</Select>

                  </FormControl>
                </Box>
              </label>
            </div>
            <div className="mb-4">
              <label className="w-100">
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  className="form-control" style={{ marginTop: "10px" }}
                  value={selectedData?.quantity || 0}
                  disabled
                />

              </label>
            </div>


            <div className="mb-4">
              <label className="w-100">
                Expenditure
                <input type="text" name="expenditure" className="form-control" style={{ marginTop: "10px" }}
                  value={expenditure}
                  onChange={(e) => {

                    setExpenditure(e.target.value);
                  }}
                />

              </label>
            </div>

            <div className="mb-4">
              <label className="w-100">
                Reason for Expenditure :
                <input as="textarea" name="remarks" className="form-control" style={{ marginTop: "10px" }}
                  value={reason}
                  onChange={(e) => {

                    setReason(e.target.value);
                  }}
                />
              </label>
            </div>

            <div className="d-flex justify-content-center align-items-center w-100">
              <button className="btn btn-primary" type="submit" onClick={(e)=>{
                e.preventDefault();
                  const addExpenditure= async()=>{
                    const response= await axios.put("https://military-asset-be-1.onrender.com/base/expenditure",{
                      soldier_serial:serial,
                      specific_name:selectedData,
                      expenditure,
                      reason_for_expenditure: reason,
                      basename:user.base
                    })
                    if(response.data.base){
                      setBase(response.data.base);
                    }
                  }
                  addExpenditure();
              }} variant="contained" color="primary" >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>



  );
};

export default Assign;
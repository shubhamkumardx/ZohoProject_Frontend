import React, { useEffect, useState } from "react";
import { BsColumnsGap } from "react-icons/bs";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GoProjectSymlink } from "react-icons/go";
import { GiProgression } from "react-icons/gi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { useFetcher, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import Box from "@mui/material/Box";
import { ThreeCircles } from 'react-loader-spinner'



function ClientList(props) {
  const [data, setData] = useState([]);
 console.log(data)
  const [Name, setName] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handlelog = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const storedResponseString = localStorage.getItem("Loginres");
    const storedResponse = JSON.parse(storedResponseString);

    setName(storedResponse);
  }, []);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/getClient');
        setData(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const HandleClient = () =>{
    navigate('/Create-Client')
  }


  return (
    <div>
      <div className="nav_1">
        <img
          src="https://status.designersx.com/css/images/cropped-logo.webp"
          className="nav_img"
        />
        <div className=" d-flex justify-content-end sizz">
          <div className="d9 d-flex">
            {/* <img src={Userimage} className="sizing1" /> */}
            <p
              className="mt-3 d8 dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
                   {Name.user?.name}
            </p>

            <ul class="dropdown-menu">
              <li>
                <a
                  // href="/"
                  className="link logo1 d-flex dropdown-item"
                  onClick={handlelog}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2 ">
          <Sidebar />
        
        </div>

        <div className="col-lg-10 t4">
          <div className="container">
            <p className="text-start  a2 mt-1 ">Client List</p>
            <p className="a3 text-start  ">
              Home / <span className=" a26">Client List</span>
            </p>

            {/* main */}


            {
              loading ?
              (
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="50vh" // Full viewport height
              >
                <ThreeCircles
                  visible={true}
                  height="80"
                  width="100"
                  color="rgb(13,110,253)"  // Change the color to your desired color
                  ariaLabel="three-circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </Box>
              )
              :
              (
                <>
                 <div className="tabb">
              <div style={{textAlign: "end", marginTop:"2%", marginRight:"3%"}}>
                <button type="button" class="btn btn-primary" onClick={HandleClient}>
                  Add Client
                </button>
              </div>
              <hr></hr>

              <table class="table tb-1">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Project Id</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                {
                  data.map((item, index)=>[
                    <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.projectId}</td>
                  
                    <td>
                      {/* <button type="button" className="btn btn-primary ">
                        Edit
                      </button> */}
                      <button type="button" className="btn btn-danger bbtn">
                        Delete
                      </button>
                    </td>
                  </tr>
                  ])
                }
            
                </tbody>
              </table>
            </div>
                
                </>
              )
            }

           
          </div>
          <br /> <br />
          <div className="hr_line"></div>
          <p className="p11 text-center mt-2">
            {" "}
            Copyright <span className="p12">Designers X.</span> All Rights
            Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientList;

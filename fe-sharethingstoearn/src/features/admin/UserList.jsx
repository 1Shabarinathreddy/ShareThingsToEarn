import React, { useEffect, useState } from "react";
import { getUsersData } from "../../api/loginapi";
import { Table } from "reactstrap";
import moment from "moment";

const UserList = () => {
  const [list, setList] = useState([]);
  const getUSersList = async () => {
    try {
      const res = await getUsersData();
      setList(res || []);
    } catch (e) {
      console.log("error->", e);
    }
  };

  useEffect(() => {
    getUSersList();
  }, []);
  return (
    <div className="d-flex justify-content-center p-5">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        </div>
        <Table hover responsive>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Date Of Birth</th>
              <th>Address</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {list?.length ? (
              list?.map((item) => (
                <tr>
                  <td>{item?.userName || "-"}</td>
                  <td>{item?.email || "-"}</td>
                  <td>{item?.phoneNumber || "-"}</td>
                  <td>
                    {item?.dateOfBirth
                      ? moment(item?.dateOfBirth).format("DD/MM/YY")
                      : "-"}
                  </td>
                  <td>{item?.address || "-"}</td>
                  <td>{item?.country || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>No Data Found</tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UserList;

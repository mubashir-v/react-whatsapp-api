import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { BiSave } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { SiPrintables } from "react-icons/si";
function RoleAdd({ permissions, handleModalClose }) {
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [],
  });

  const firstInputRef = useRef(null);
  const lastInputRef = useRef(null);

  const handlePermissionSelect = (selectedOptions) => {
    const selectedPermissions = selectedOptions.map((option) => option);
    setNewRole({ ...newRole, permissions: selectedPermissions });
    lastInputRef.current.focus();

  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRole({ ...newRole, [name]: value });
  };

  useEffect(() => {
    // Focus on the first input field when the component mounts
    firstInputRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL + "auth/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newRole),
    });
    if (response.ok) {
      const updatedRoles = await response.json();
      console.log(updatedRoles);
      setRoles([...roles, updatedRoles.data]);
      setShowModal(false);
      setNewRole({ name: "", permissions: [] });
    } else {
      console.error("Failed to add role");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.target === lastInputRef.current) {
        handleSubmit();
      } else {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        if (form.elements[index + 1]) {
          form.elements[index + 1].focus();
        }
      }
    }
  };
  return (
    <div className="fixed inset-0 bg-slate-50 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4  border-2 shadow-md w-6/12">
        <h2 className="text-lg flex justify-center font-bold text-pink-900 mb-4">
          <SiPrintables fontSize={16} />
          <p className="quantico-regular text-sm   px-3">Create Role</p>
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Enter role name"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
            name="name"
            value={newRole.name}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={firstInputRef}
          />
          <Select
            options={permissions}
            isMulti
            placeholder="Select permissions"
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option._id}
            onChange={handlePermissionSelect}
            onKeyDown={handleKeyDown}
            ref={lastInputRef}
          />
          <div className="flex justify-center p-4">
            <button
              className="px-4 py-2 text-pink-900 border-2 rounded-md mr-2"
              onClick={handleSubmit}
            >
              <BiSave className="text-lg" />
            </button>
            <button
              className="px-4 py-2  text-pink-900 border-2 rounded-md"
              onClick={handleModalClose}
            >
              <MdCancel className="text-lg" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoleAdd;

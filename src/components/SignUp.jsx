"use client";
import React, { useState } from "react";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  ListItemPrefix,
  Textarea,
} from "@material-tailwind/react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaLinkedin } from "react-icons/fa";
import { IconButton, List, ListItem, Radio } from "@mui/material";
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedinProfile: "",
    phoneNumber: "",
    projectDescription: "",
    agreeToTerms: false,
    buy: false,
    sell: false,
  });
  const [formError, setFormError] = useState("")
const [loader, setLoader] = useState(false)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      phoneNumber: value,
    }));
  };

  const handleOptionClick = (option) => {
    setFormData((prevData) => ({
      ...prevData,
      [option]: !prevData[option],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setLoader(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.projectDescription ||
      (!formData.buy && !formData.sell)
    ) {
      setFormError("Please fill out all fields.");
      setLoader(false);
      return;
    }

    try {

      const docRef = await addDoc(collection(db, "signUpRequest"), {
        name: formData.name,
        email: formData.email,
        linkedinProfile: formData.linkedinProfile,
        phoneNumber: formData.phoneNumber,
        projectDescription: formData.projectDescription,
        buy: formData.buy,
        sell: formData.sell,
        activate: "Pending",
        createdAt: serverTimestamp()
      });

      // Handle file upload if a file is selected
      
setFormError("")
      alert("Form submitted successfully!");
      console.log("Form submitted with:", formData);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        linkedinProfile: "",
        phoneNumber: "",
        projectDescription: "",
        agreeToTerms: false,
        buy: false,
        sell: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("Error submitting form. Please try again later.");
    }

    setLoader(false);
    
  };

  return (
    <Card color="transparent" shadow={false} className="mt-[14rem]">
      <Typography variant="h4" color="blue-gray" className=" font-gilroy-bold text-2xl">
        Sign Up
      </Typography>
      <form
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Name
          </Typography>
          <Input
            size="lg"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleInputChange}
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            size="lg"
            name="email"
            placeholder="name@mail.com"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            LinkedIn Profile
          </Typography>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-gray-600">
              <FaLinkedin size={20} />
            </div>
            <Input
              size="lg"
              name="linkedinProfile"
              placeholder="https://www.linkedin.com/in/username"
              value={formData.linkedinProfile}
              onChange={handleInputChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 pl-10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Contact Number
          </Typography>
          <PhoneInput
            country="us"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            containerClass="min-w-full mb-4"
            inputClass="min-w-full border border-gray-300 p-5 rounded-md"
            dropdownClass="country-dropdown"
            className="w-full border-blue-gray-900 focus:!border-t-gray-900"
            enableSearch={true}
            disableSearchIcon={true}
          />

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            I am looking to
          </Typography>
          <Card className="w-full max-w-[24rem] bg-transparent shadow-none">
            <List className="flex flex-row justify-between">
              <ListItem className="p-0 flex-grow">
                <label
                  htmlFor="horizontal-list-buy"
                  className="flex w-full cursor-pointer items-center justify-start space-x-4 px-3 py-2 bg-white border border-black rounded-lg"
                  onClick={() => handleOptionClick("buy")}
                >
                  <ListItemPrefix className="mr-3">
                    <Checkbox
                      id="horizontal-list-buy"
                      name="buy"
                      ripple={false}
                      className="hover:before:opacity-0"
                      containerProps={{
                        className: "p-0",
                      }}
                      checked={formData.buy}
                      onChange={handleInputChange}
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className={`font-medium ${
                      formData.buy ? "text-blue-500" : "text-blue-gray-400"
                    }`}
                  >
                    Buy
                  </Typography>
                </label>
              </ListItem>

              <ListItem className="p-0 flex-grow">
                <label
                  htmlFor="horizontal-list-sell"
                  className="flex w-full cursor-pointer items-center justify-start space-x-4 px-3 py-2 bg-white border border-black rounded-lg"
                  onClick={() => handleOptionClick("sell")}
                >
                  <ListItemPrefix className="mr-3">
                    <Checkbox
                      id="horizontal-list-sell"
                      name="sell"
                      ripple={true}
                      className="hover:before:opacity-0"
                      containerProps={{
                        className: "p-0",
                      }}
                      checked={formData.sell}
                      onChange={handleInputChange}
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className={`font-medium ${
                      formData.sell ? "text-blue-500" : "text-blue-gray-400"
                    }`}
                  >
                    Sell
                  </Typography>
                </label>
              </ListItem>
            </List>
          </Card>
        </div>

        <Typography variant="h6" color="blue-gray" className="mb-1 mt-5">
          Project Description
        </Typography>
        <div className="flex w-full flex-row items-center gap-2 rounded-lg border border-gray-900/10 bg-gray-900/5 p-2 mb-5">
          <Textarea
            rows={1}
            resize={true}
            name="projectDescription"
            placeholder="Your Message"
            value={formData.projectDescription}
            onChange={handleInputChange}
            className="min-h-full !border-0 focus:border-transparent "
            containerProps={{
              className: "grid h-full",
            }}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>
        <Checkbox
          className=""
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center font-normal"
            >
              I agree the
              <a
                href="#"
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5 " }}
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
        />
        <Button className="mt-6" fullWidth type="submit" loading={loader}>
          Sign Up
        </Button>
        {formError &&
            (
                <div className=" mt-3 text-sm font-gilroy-medium  text-red-400">{formError}</div>
            )
        }
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a href="#" className="font-medium text-gray-900">
            Sign In
          </a>
        </Typography>
      </form>
    </Card>
  );
}

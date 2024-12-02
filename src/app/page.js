"use client";
import { Formik, Field, Form } from "formik";
import { useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import { authContext } from "../assets/context/use-context";
import toast from "react-hot-toast";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(authContext);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (formValue, helpers) => {
    try {
      setLoading(true);
      const res = await loginUser(formValue.email, formValue.password);
      console.log("LOGIN_RESPONSE ",res);
      setLoading(false);
      helpers.resetForm();
    } catch (err) {
      setLoading(false);
      toast.error(err);
    }
  };

  return (
    <section className="bg-background h-screen">
      <div className="flex items-center justify-center h-screen md:w-9/12 w-11/12 mx-auto">
        <div className="md:block hidden w-1/2 shadow text-white bg-primary rounded-tl-xl rounded-bl-xl h-[70vh]">
          <h1 className="text-2xl font-bold flex items-center justify-center h-[70vh]">
            Learning Management System
          </h1>
        </div>
        <div className="md:w-1/2 w-full bg-white shadow md:px-12 px-4 md:rounded-tr-xl md:rounded-br-xl h-[70vh] flex items-center justify-center">
          <Formik initialValues={initialValues} onSubmit={handleLogin}>
            <Form className="space-y-4 w-full">
              <Field
                required
                id="username"
                className="block border rounded text-xs border-gray py-3 px-4 focus:outline-none w-full"
                type="email"
                placeholder="email"
                name="email"
              />
              <Field
                id="password"
                className="block border rounded text-xs border-gray py-3 px-4 focus:outline-none w-full"
                type="password"
                placeholder="Password"
                name="password"
              />
              <button
                id="loginButton"
                type="submit"
                className="bg-primary rounded w-full px-8 py-3 text-xs text-white"
              >
                {loading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    ></path>
                  </svg>
                )}
                Login
              </button>
              <div className="flex items-center justify-end">
                <Link href="/" className="text-link text-xs">
                  Forgot Password
                </Link>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </section>
  );
}

"use client";
import { authContext } from "@/assets/context/use-context";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { fetchProfileData } from "../redux/features/profile";
import { useAuth } from "@/assets/hooks/use-auth";
import { useDispatch, useSelector } from "react-redux";
import EditProfile from "../components/user-profile";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { profileData } = useSelector((store) => store.profile);
  const { user } = useContext(authContext);
  const dispatch = useDispatch();
  const token = useAuth();
  const [showEditComponent, setShowEditComponent] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      dispatch(fetchProfileData(token))
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [token,profileData]);

  useEffect(() => {
    if (profileData?.profile) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [profileData]);

  return (
    <div className="w-10/12 mx-auto">
      <section className="flex items-center justify-between mb-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div>
            <IoIosArrowRoundBack />
          </div>
          <div>
            {!profileData.profile?.image ? (
              <FaUserCircle className="w-8 h-8" />
            ) : (
              <img
                className="h-10 w-10 rounded-full object-cover shadow-xl"
                src={profileData.profile?.image}
                alt=""
              />
            )}
          </div>
          <div>
            <p className="text-xl font-bold ">{user?.username}</p>
          </div>
        </Link>

        {profileData?.profile === null ? (
          <div
            onClick={() => setShowEditComponent(true)}
            className="flex items-center gap-2 bg-primary text-background shadow-2xl rounded px-3 py-2 cursor-pointer"
          >
            <FaUserEdit className="" />
            <p className="text-xs font-bold">Create Profile</p>
          </div>
        ) : (
          <div
            onClick={() => setShowEditComponent(true)}
            className="flex items-center gap-2 bg-primary text-background shadow-xl rounded px-3 py-2 cursor-pointer"
          >
            <FaUserEdit className="" />
            <p className="text-xs font-bold">Edit Profile</p>
          </div>
        )}
      </section>
      <hr className="text-gray mb-4" />
      {showEditComponent ? (
        <EditProfile {...{ setShowEditComponent, profileData, isEditMode }} />
      ) : (
        <>
          <section className="flex justify-between gap-4">
            <div className="w-4/12">
              {loading ? (
                <Skeleton
                  baseColor="#c0c0c0"
                  highlightColor="#f0f0f0"
                  count={2}
                  height={100}
                />
              ) : (
                <>
                  <p className="text-xs uppercase">Profile image</p>
                  {!profileData.profile.image ? (
                    <FaUserCircle className="w-40 h-56" />
                  ) : (
                    <img
                      className="rounded h-56 w-full mt-4 object-cover shadow-2xl"
                      src={profileData?.profile?.image}
                      alt=""
                    />
                  )}
                </>
              )}
            </div>

            <div className="w-4/12">
              {loading ? (
                <Skeleton
                  baseColor="#c0c0c0"
                  highlightColor="#f0f0f0"
                  count={2}
                  height={100}
                />
              ) : (
                <>
                  <p className="text-xs uppercase">Bio</p>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">role</span>
                    <span className="text-sm font-bold">
                      {profileData?.role}
                    </span>
                  </div>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">department</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.department}
                    </span>
                  </div>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">supervisor</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.supervisor}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="w-4/12">
              {loading ? (
                <Skeleton
                  baseColor="#c0c0c0"
                  highlightColor="#f0f0f0"
                  count={2}
                  height={100}
                />
              ) : (
                <>
                  <p className="text-xs uppercase">Employement details</p>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">bank details</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.bankAccount}
                    </span>
                  </div>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">email</span>
                    <span className="text-sm font-bold">
                      {profileData?.email}
                    </span>
                  </div>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">employment status</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.employmentStatus}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>
          <hr className="text-gray my-4" />
          {loading ? (
            <Skeleton
              baseColor="#c0c0c0"
              highlightColor="#f0f0f0"
              count={2}
              height={100}
            />
          ) : (
            <section>
              <h1 className="uppercase text-xs">Employee details</h1>
              <section className="flex items-center justify-between gap-4">
                <div className="w-4/12">
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">firstname</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.firstName}
                    </span>
                  </div>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">lastname</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.lastName}
                    </span>
                  </div>
                </div>
                <div className="w-4/12">
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">phonenumber</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.phoneNumber}
                    </span>
                  </div>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">gender</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.gender}
                    </span>
                  </div>
                </div>
                <div className="w-4/12">
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">job title</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.jobTitle}
                    </span>
                  </div>
                  <div className="bg-white shadow rounded px-4 py-2 text-sm mt-4 flex flex-col">
                    <span className="text-xs font-thin">employment type</span>
                    <span className="text-sm font-bold">
                      {profileData?.profile?.employmentType}
                    </span>
                  </div>
                </div>
              </section>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;

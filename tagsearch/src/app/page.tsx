"use client";
import React from "react";
import SplashPage from "../components/SplashPage";
import { connect } from "http2";
import connectMongoDB from "../../config/mongodb";

export default function Home() {
  return (
    <div>
      <SplashPage />
    </div>
  );
}

"use client";

import React, { Suspense } from "react";
import HomePage from "../src/home/page";
const Home = () => {
  return (
    <div>
      <Suspense>
        <HomePage />
      </Suspense>
    </div>
  );
};

export default Home;

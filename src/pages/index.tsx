import { type NextPage } from "next";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Style from "./Index.module.css";
import Head from "next/head";
import { type majorStar } from "~/server/api/routers/stars";
import { useRouter } from "next/router";
import Link from "next/link";

const Testpage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Fixed Stars</title>
      </Head>
      <NavButtons></NavButtons>
    </div>
  );
};
export default Testpage;


const NavButtons: React.FC = () => {
  return (
    <div className={Style.buttonsContainer}>
          <Link href="/stars" >
            <p className={Style.button}>
              Fixed Stars
            </p>
          </Link>

          <Link href="/planets" >
            <p className={Style.button}>
             Planets
            </p>
          </Link>
          
          <Link href="/houses" >
            <p className={Style.button}>
             Houses
            </p>
          </Link>
    </div>
  )
}
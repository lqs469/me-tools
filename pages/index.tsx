/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import configs from "../config";

const handleImgSrc = (src: string) => {
  if (src.includes("nftstorage")) {
    src = src.replace(/nftstorage/g, "dweb");
  }

  return src;
};

const handleTime = (time: string) => {
  return new Date(time).toLocaleString();
};

const getLaunchPage = (symbol: string) => {
  return `https://magiceden.io/launchpad/${symbol}`;
};

const isToday = (time: string) => {
  const inputDate = new Date(time).getTime();
  const todaysDate = new Date().getTime();
  if (Math.abs(inputDate - todaysDate) < 1000 * 60 * 60 * 24 * 2) {
    return true;
  }

  return false;
};

const Home: NextPage = () => {
  const [launchpad, setLaunchpad] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/bridge", {
      method: "POST",
      body: JSON.stringify({
        url: configs.launchpad_collections,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLaunchpad(
          data.data.sort(
            (a: any, b: any) =>
              new Date(a.launchDate).getTime() +
              (a.finished ? Number.MAX_SAFE_INTEGER : 0) -
              new Date(b.launchDate).getTime()
          )
        );
      });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>ME Tool</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>ME Tool</h1>
        <p className={styles.description}>Launchpad</p>

        <div className={styles.grid}>
          {launchpad.map((item, idx) => (
            <div
              key={idx}
              className={`${styles.card} ${item.finished ? "opacity-50" : ""} ${
                isToday(item.launchDate) ? "bg-green-500" : ""
              } mt-1 mr-1 p-1 rounded-lg w-56`}
            >
              <a href={item.websiteLink}>
                <h2 className="text-lg font-bold">{item.name}</h2>
              </a>
              <small>launchDate: {handleTime(item.launchDate)}</small>
              <img src={handleImgSrc(item.image)} alt={item.name} className="block w-56 h-56 bg-slate-100" />
              <p className="w-full flex justify-between font-bold">
                <span>price: {item.price}</span>
                <span>size: {item.size}</span>
              </p>
              <p className="w-full flex justify-between">
                {item.finished ? (
                  <span className="text-red-500">Finished</span>
                ) : (
                  <span className="text-green-500">Running</span>
                )}
                <a href={getLaunchPage(item.symbol)} target="blank">
                  launchpad
                </a>
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;

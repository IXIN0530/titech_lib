"use client"
import { BookStateType } from "@/type";
import { AnimatePresence, motion, number, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
type Props = {
  state: BookStateType[]
  id: string,
  title: string,
  isLoading: boolean,
  deleteById: (id: string) => void
  delay: number
}
//本の状態リストの要素
const BookState = ({ state, id, title, isLoading, deleteById, delay }: Props) => {
  //蔵書の数
  const num = state.length;
  //x方向のドラッグ情報を保持
  const x = useMotionValue(1);
  const opacity = useTransform(x, [-100, 0], [0, 1]);
  //detailが開かれているか
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  //stateの配列を受け取って貸し出し可能があるかどうかを調べる。
  const isAvailable = (l: BookStateType[]) => {
    for (let i = 0; i < l.length; i++) {
      if (l[i].state.includes("貸出可")) {
        return true;
      }
    }
    return false;
  }

  //本の状況 0...貸出可 1...貸出中 2...nowLoading
  const bookState = (isLoading) ? 2 : (isAvailable(state)) ? 0 : 1;

  //やることメモ
  // 1. まるとバツが表示されるようにする(const bookStateがレンダリングを毎回されるか)
  // 2. 








  return (
    <motion.div className=" mx-2 overflow-x-hidden my-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut", delay: delay }}
    >
      <AnimatePresence>
        <motion.div className=" h-full grid grid-cols-10  bg-white shadow-lg border border-gray-200 items-center "
          initial={{ borderLeft: "4px solid #999999" }}
          animate={bookState == 0 ? { borderLeft: "4px solid #00FF00", }
            : bookState == 1 ? { borderLeft: "4px solid #FF0000", }
              : { borderLeft: "4px solid #999999", }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          drag="x"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x < -200) {
              //左にスワイプされた場合、この項目を削除
              deleteById(id);
            }
          }}
          style={{ x, opacity }}
        >
          <p className="px-1 text-center col-span-7 font-bold text-sm">{title}</p>
          <div className="text-center col-span-3 h-full grid grid-rows-3 ">
            <div className="row-span-2 flex flex-row justify-end mx-4 mt-2 ">
              <AnimatePresence>
                <motion.div className=""
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1, ease: "easeInOut", delay: delay }}>
                  {bookState == 2 ? <div></div> :
                    bookState == 0 ? <Image className="mx-auto " alt="" src={"/blueCircle.png"} width={30} height={30} unoptimized></Image>
                      : <Image className="mx-auto " alt="" src={"/redCross.png"} width={30} height={30} unoptimized></Image>}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="row-span-1 grid grid-cols-5 items-center">
              <div className="col-span-4"></div>
              <div className="col-span-1 ">
                <button onClick={() => setIsDetailOpen(!isDetailOpen)} className="relative ">
                  <AnimatePresence>
                    {isDetailOpen &&
                      <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 absolute -left-3 -bottom-0"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                      </motion.svg>
                    }

                  </AnimatePresence>

                  <AnimatePresence>
                    {!isDetailOpen &&
                      <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 absolute -left-3 -bottom-0"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </motion.svg>
                    }
                  </AnimatePresence>

                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {isDetailOpen &&
          <motion.div className="bg-white shadow-lg border border-gray-200 p-2 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <p className="text-sm">HIT:{num}個</p>
            <ul className="list-disc pl-5">
              {state.map((s, index) => (
                <li key={index} className="text-sm">
                  {s.reserveURL.length > 5 ? <a target="_blank" className="text-blue-500" href={s.reserveURL}>{s.state}</a> : s.state}- {s.volume} - {s.location}
                  {s.due.length > 3 ? <span className="text-red-600"> - {s.due}まで貸出中</span> : <></>} - {s.cnu}
                </li>
              ))}
            </ul>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>
  )
}

// <div className="row-span-1 border border-black p-2 grid grid-cols-8 items-center">
//   {/* ヘッダー部分 */}
//   <div className="col-span-1"></div>
//   <div className="col-span-1">
//     <p className="text-center">状態</p>
//   </div>
//   <div className="col-span-1">
//     <p className="text-center">巻</p>
//   </div>
//   <div className="col-span-1">
//     <p className="text-center">場所</p>
//   </div>
//   <div className="col-span-1">
//     <p className="text-center">状態</p>
//   </div>


// </div>
export default BookState;
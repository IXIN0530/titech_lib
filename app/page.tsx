"use client"

import BookState from "@/components/bookState";
import { BookStateType, BookType } from "@/type";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  //初回マウント
  const didMountRef = useRef(false);
  //保存された図書ID
  const [bookIds, setBookIds] = useState<string[]>([]);
  //名前、Id,stateがセットになったもの
  const [books, setBooks] = useState<BookType[]>([]);
  //今データを取得しているかどうか
  const [isLoading, setIsLoading] = useState(false);

  //状態を取得するメソッド
  const getState = async (bookId: string) => {
    const resState = await axios.get("/api/getBookStatus?bookId=" + bookId);
    if (resState.data["status"] === 404) {
      return []
    }
    return resState.data["data"] as BookStateType[];
  }
  //図書名を取得するメソッド
  const getTitle = async (bookId: string) => {
    const resTitle = await axios.get("/api/getBookName?bookId=" + bookId);
    if (resTitle.data["status"] === 404) {
      return "NotFound";
    }
    return resTitle.data["data"] as string;
  }
  //bookIdを受け取り、それを削除したbooks,bookIdsを作成
  const deleteById = (bookId: string) => {
    const newBooks = books.filter(book => book.id !== bookId);
    const newBookIds = bookIds.filter(id => id !== bookId);
    setBooks(newBooks);
    setBookIds(newBookIds);
  }

  //与えられたBookIdsに対して、図書名と状態を取得し、booksに格納する
  const getAllBooksData = async (bookIds: string[]) => {
    if (isLoading) return; // すでにデータを取得中の場合は何もしない
    setIsLoading(true);
    let count = bookIds.length;
    const newBooks: BookType[] = [];

    bookIds.forEach(async (bookId) => {
      const bookTitle = await getTitle(bookId);
      const bookState = await getState(bookId);
      count--;
      if (bookState.length === 0) return; // 状態が取得できない場合はスキップ
      newBooks.push({ title: bookTitle, id: bookId, state: bookState });
    });

    while (count > 0) {
      await new Promise(resolve => setTimeout(resolve, 100)); // 少し待つ
    }
    setBooks(newBooks);
    setIsLoading(false);
  }

  // const bookId = "BB16838611";
  //idを入力し、本のデータを取得するメソッド
  // const getBookData = async (bookId: string) => {
  //   const bookState = getState(bookId);
  //   const bookTitle = await getTitle(bookId);
  //   console.log(bookState);
  //   console.log(bookTitle);
  // }

  //追加ボタンのRef
  const inputIdRef = useRef<HTMLInputElement>(null);

  //追加ボタンを押した時の処理
  const addBookID = async () => {
    if (isLoading) return; // すでにデータを取得中の場合は何もしない
    setIsLoading(true);
    if (!inputIdRef.current?.value) {
      alert("図書IDを入力してください");
      setIsLoading(false);
      return;
    }
    const newBookId = inputIdRef.current.value as string;
    //すでに追加されている場合は何もしない
    if (bookIds.includes(newBookId)) {
      alert("すでに追加されています");
      setIsLoading(false);
      return;
    }
    //図書IDが有効かを確認
    const bookState = await getState(newBookId);
    if (bookState.length === 0) {
      alert("図書IDが無効です");
      setIsLoading(false);
      return;
    }
    //図書名を取得
    const bookTitle = await getTitle(newBookId);
    setBookIds([...bookIds, newBookId]);
    setBooks([...books, { title: bookTitle, id: newBookId, state: bookState }]);
    //ローカルストレージに保存
    localStorage.setItem("bookIds", JSON.stringify([...bookIds, newBookId]));
    inputIdRef.current.value = ""; // 入力欄をクリア
    setIsLoading(false);
  }

  useEffect(() => {
    if (!didMountRef.current) {
      // localStorage.removeItem("bookIds");
      didMountRef.current = true;
      // 初回マウント時に実行する処理
      const strage = localStorage.getItem("bookIds");
      if (strage) {
        const storedBookIds = JSON.parse(strage) as string[];
        setBookIds(storedBookIds);

        //有効なIDに対してStateを取得して格納
        getAllBooksData(storedBookIds);
      }
    }
  }, []);

  // bookIdsが更新されたときにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("bookIds", JSON.stringify(bookIds));
  }, [bookIds]);

  return (
    <div className="min-h-[100svh]  grid grid-rows-12 bg-stone-50">
      <div className="row-span-1 my-auto">
        <p className="text-center  text-xl font-bold">東京科学大学図書確認システム</p>
      </div>
      <div className="row-span-1 my-auto mx-auto">
        <Link href={"/usage"} className="border-b border-blue-700  text-blue-700">使い方</Link>
      </div>
      <div className="row-span-2  flex flex-col justify-evenly">
        <input ref={inputIdRef} placeholder="図書(書誌)IDを入力してください" className="border border-black py-2 rounded-lg text-center bg-white max-w-2xl mx-auto w-3/5 text-sm" />
        <div className="flex justify-center relative">
          <button onClick={addBookID} className=" font-bold bg-gradient-to-br from-emerald-300 to-emerald-400 w-1/4 mx-auto py-2 text-white shadow-lg  rounded-lg max-w-xs">追加</button>
          <div className="absolute right-8 bottom-2" onClick={() => getAllBooksData(bookIds)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
            </svg>

          </div>
        </div>
      </div>
      <div className="row-span-7  relative overflow-y-auto">
        {books.length === 0 && isLoading && <p className="text-center">Now Loading...</p>}
        <div className="absolute inset-0 ">
          {books.map((element, index) => {
            //出現の誤差
            const delay = index * 0.2;
            return (
              <BookState delay={delay} deleteById={deleteById} key={index} id={element.id} state={element.state} title={element.title} isLoading={isLoading} />
            )
          })}
        </div>
      </div>
    </div>
  );
}

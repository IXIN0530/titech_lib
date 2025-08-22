import { NextRequest, NextResponse } from "next/server";
import * as cheerio from 'cheerio'
import axios from "axios";
import { BookStateType } from "@/type";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  const extractURL = (str: string) => {
    const pattern = /'(.*?)'/; // ダブルクォーテーションで囲まれた部分にマッチ

    const match = str.match(pattern);

    if (match) {
      return match[1]; // キャプチャグループ[1]に目的の文字列が入る
    }
    else return "";
  }

  const url = "https://topics.libra.titech.ac.jp/xc_search/ajax/ncip_info_full?provider_id=1&bib_ids=" + bookId;

  try {
    const res = axios.get(url);
    const data = (await res).data["content"];

    //idが間違っていた場合
    if (!data) {
      return NextResponse.json({ data: "NotFound", status: 404 });
    }

    const $ = cheerio.load(data);
    // const neededRange = $("div[class='loBook01 clearfix']").eq(1);

    let returnList: BookStateType[] = [];

    //全ての本の↑芦田氏情報を取得
    $("div[class='loBook01 clearfix']").each((index, element) => {
      //はじめのは何も入ってへんから飛ばす
      if (index == 0) return;

      const neededRange = $(element);
      //範囲は絞ったので抽出
      const state = neededRange.find(".bkAva").find("dd").text();
      const volume = neededRange.find(".bkVol").find("dd").text();
      const location = neededRange.find(".bkLoc").find("a").text();
      const cnu = neededRange.find(".bkCnu").find("dd").text();
      const due = neededRange.find(".bkDue").find("dd").text();
      const Id = neededRange.find(".bkHId").find("dd").text();
      const reserveURL = neededRange.find(".spDisNon").find("button").attr("onclick") || "";

      //urlだけ抽出
      const reData: BookStateType = {
        state: state,
        volume: volume,
        location: location,
        cnu: cnu,
        due: due,
        id: Id,
        reserveURL: extractURL(reserveURL),
      }

      returnList = [...returnList, reData];
    })



    return NextResponse.json({ data: returnList });
  } catch (e) {
    return NextResponse.json({ data: "err" });
  }
}
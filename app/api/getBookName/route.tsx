import axios from "axios";
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ data: "NotFound", status: 404 });
  }

  const url = "https://topics.libra.titech.ac.jp/recordID/catalog.bib/" + bookId;

  const res = await axios.get(url);
  const data = res.data;

  const $ = cheerio.load(data);
  const title = $(".mainBox").find("h3").text();
  if (!title) {
    return NextResponse.json({ data: "NotFound" });
  }
  return NextResponse.json({ data: title });
}
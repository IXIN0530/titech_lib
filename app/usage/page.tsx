import Link from "next/link";

export default function Usage() {
  return (
    <div className="min-h-[100svh] mx-2 mt-2">
      <h1 className="text-2xl font-bold text-center">使用方法</h1>
      <p className="text-center mt-4">このアプリは、東京科学大学の図書の貸出状況を確認するためのものです。</p>
      <p className="text-center mt-2">図書ID(書籍ID)を入力して「追加」ボタンを押すことで、該当の本の貸出情報を素早く確認することができます。</p>
      <p className="text-center mt-2">本アプリ最大のメリットは、<span className="text-red-600 font-bold">過去に追加したものがページにアクセスするだけで調べられる</span>ことです。複数冊の本を監視したいときにいちいち確認しにいく必要がありません。</p>

      <p className="text-center mt-4">追加した後削除したい場合は、リスト要素を左にスワイプすることで削除できます。</p>
      <p className="text-center mt-2">リスト要素右下のボタンを押すことで詳細が見られます。「<span className="text-blue-500">貸出中</span>」となっている部分に関しては、クリックすることで予約ページに飛べます。</p>
      <p className="text-center mt-2">また、本アプリの不具合による被害は一切責任を取りかねますのでご了承ください。</p>

      <div className="mt-8 mx-auto flex justify-center">
        <Link href={"../"} className="border-b border-black">＜ 戻る</Link>
      </div>
    </div>
  );
}
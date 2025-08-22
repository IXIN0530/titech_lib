export type BookStateType = {
  state: string,
  volume: string,
  location: string,
  cnu: string,
  due: string,
  id: string,
  reserveURL: string,
}

export type BookType = {
  title: string,
  id: string,
  state: BookStateType[]
}
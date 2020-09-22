type FromJSON = (json: Map<string, any>) => any
export class JsonHelper {
  static jsonToArray<T>(jsonList: any, method: FromJSON): T[] {
    const listaFinal: T[] = []

    jsonList.forEach((e: any) => {
      listaFinal.push(method(e))
    })

    return listaFinal
  }
}

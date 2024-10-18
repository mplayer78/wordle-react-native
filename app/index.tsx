import { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import words from '../words.json';

function createEmptyBoard() {
  return new Array(6).fill(0).map(() => new Array(5).fill(1).map(createEmptyKeyData))
}

function createEmptyKeyData() : KeyData{
  return {
    character: "",
    state: KeyState.EMPTY
  }
}

const cellStyles = StyleSheet.create({
  cell: { 
    width:50, 
    height:50, 
    alignItems:"center", 
    justifyContent:"center"
  },
  text: {
    fontSize: 30, 
    fontWeight: 800
  },
  empty: {
    borderColor:"dimgray", 
    borderWidth: 2,
  },
  filled: {
    borderColor:"dimgray", 
    borderWidth: 2,
  },
  correct: { 
    backgroundColor: "limegreen"
  },
  partiallyCorrect: { 
    backgroundColor: "gold"
  },
  incorrect: { 
    backgroundColor: "dimgray"
  },
})

function Cell(props: KeyData) {
  let styles = cellStyles.cell
  switch (props.state) {
    case KeyState.EMPTY:
      styles = {...styles, ...cellStyles.empty}
      break
    case KeyState.FILLED:
      styles = {...styles, ...cellStyles.filled}
      break
    case KeyState.CORRECT:
      styles = {...styles, ...cellStyles.correct}
      break
    case KeyState.PARTIAL:
      styles = {...styles, ...cellStyles.partiallyCorrect}
      break
    case KeyState.INCORRECT:
      styles = {...styles, ...cellStyles.incorrect}
      break
  }
  return (
    <View style={styles}>
      <Text style={cellStyles.text}>{props.character}</Text>
    </View>
  )
}

type WordLineProps = {
  cells: Array<KeyData>
}

function WordLine(props: WordLineProps) {
  return (
    <View style={{ flexDirection: "row", gap: 3}}>
      { props.cells.map((s, i) => (
        <Cell key={"cell_"+i} {...s} />
      ))}
    </View>
  )
}

type WordBoardProps = {
  board: Array<Array<KeyData>>,
}

function WordBoard(props: WordBoardProps) {
  return (
    <View style={{ flexDirection: "column", gap: 3}}>
    { props.board.map((v, i) => (
      <WordLine key={i} cells={v}/>
    ))}
    </View>
  )  
}

type KeyProps = {
  character: KeyData
  press: () => void
  wide?: boolean
}

const keyStyles = StyleSheet.create({
  cell: { 
    backgroundColor: "grey", 
    padding: 4, 
    width: 32, 
    height: 48, 
    alignItems: "center", 
    justifyContent: "center", 
    borderRadius: 3 
  },
  text: {
    fontSize: 30, 
    fontWeight: 800
  },
  empty: {
    borderColor:"dimgray", 
    borderWidth: 2,
  },
  filled: {
    borderColor:"dimgray", 
    borderWidth: 2,
  },
  correct: { 
    backgroundColor: "limegreen"
  },
  partiallyCorrect: { 
    backgroundColor: "gold"
  },
  incorrect: { 
    backgroundColor: "dimgray"
  },
})

function Key(props: KeyProps) {
  const k = props.character
  let styles = keyStyles.cell
  switch (k.state){
    case KeyState.EMPTY:
      styles = {...styles, ...cellStyles.empty}
      break
    case KeyState.FILLED:
      styles = {...styles, ...cellStyles.filled}
      break
    case KeyState.CORRECT:
      styles = {...styles, ...cellStyles.correct}
      break
    case KeyState.PARTIAL:
      styles = {...styles, ...cellStyles.partiallyCorrect}
      break
    case KeyState.INCORRECT:
      styles = {...styles, ...cellStyles.incorrect}
      break
  }
  if (props.wide) {
    styles = {...styles, width: 32 * 1.5}
  }
  return (
    <View>
      <Pressable onPress={props.press} style={styles}>
        <Text style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{k.character}</Text>
      </Pressable>
    </View>
  )
}

type KeyboardProps = {
  keys: Array<KeyData>,
  onKey: (x: string) => void,
  onDel: () => void,
  onEnter: () => void
}

enum KeyState {
  EMPTY,
  FILLED,
  INCORRECT,
  PARTIAL,
  CORRECT
}

type KeyData = {
  character: string,
  state: KeyState
}

function Keyboard(props: KeyboardProps) {
  return (
    <View style={{ flexDirection: "column", gap: 3, alignItems: "center" }}>
      <View style={{ flexDirection: "row", gap: 3 }}>
        { props.keys.slice(0, 10)
          .map(v => (
            <Key key={v.character} character={v} press={() => props.onKey(v.character)} />
          )) }
      </View>
      <View style={{ flexDirection: "row", gap: 3 }}>
        { props.keys.slice(10, 19)
        .map(v => (
          <Key key={v.character} character={v} press={() => props.onKey(v.character)} />
        )) }
      </View>
      <View style={{ flexDirection: "row", gap: 3 }}>
        <Key character={{ character: "enter", state: KeyState.EMPTY }} press={() => props.onEnter()} wide/>
        { props.keys.slice(19, 26)
            .map(v => (
          <Key key={v.character} character={v} press={() => props.onKey(v.character)} />
        )) }
        <Key character={{ character: "del", state: KeyState.EMPTY }} press={() => props.onDel()} wide/>
      </View>
    </View>
  )
}

function createKeyboard() : Array<KeyData>{
  return "qwertyuiopasdfghjklzxcvbnm"
          .toUpperCase()
          .split("")
          .map(c => (
            {
              character: c,
              state: KeyState.EMPTY
            }
          ))
}

function scrapeBoardState(boardState: KeyData[][]) : Array<KeyData> {
  return createKeyboard().map(k => {
    for (const row of boardState) {
      for (const cell of row) {
        if (cell.character === k.character) {
          if (k.state < cell.state) {
            k.state = cell.state
          }
        }
      }
    }
    return k
  })
}

enum GameState {
  START,
  IN_PROGRESS,
  COMPLETE,
}

function getWord(arr: Array<KeyData>) : string {
  return arr.reduce((acc, val) => acc + val.character, "")
}

export default function Index({navigation}: {navigation: any}) {
  const [boardState, updateBoardState] = useState(createEmptyBoard())
  const [row, setRow] = useState(0)
  const [column, setColumn] = useState(0)
  const [keyboardState, setKeyboardState] = useState(createKeyboard())
  const [gameState, setGameState] = useState(GameState.START)
  
  useEffect(() => {
    setKeyboardState(scrapeBoardState(boardState))
  }, [boardState[0], boardState[1], boardState[2]])
      
  const handleKey = (x: string) => {
    if (gameState === GameState.COMPLETE) {
      return
    }
    if (gameState === GameState.START) {
      setGameState(GameState.IN_PROGRESS)
    }
    if (column < boardState[0].length) {
      boardState[row][column] = {
        character: x,
        state: KeyState.FILLED
      }
      updateBoardState(boardState)
      setColumn(column + 1)
    }
  }
  const handleEnter = () => {
    if (gameState === GameState.COMPLETE) {
      return
    }
    boardState[row] = checkWord("PALMS", boardState[row])
    if (column < boardState[0].length) {
      return
    }
    if (words.indexOf(getWord(boardState[row])) < 0) {
      return
    }
    if (boardState[row].every(v => v.state === KeyState.CORRECT)) {
      setGameState(GameState.COMPLETE)
      return
    }
    if ((row) < boardState.length) {
      setRow(row + 1)
      setColumn(0)
    }
  }
  const handleDel = () => {
    if (gameState === GameState.COMPLETE) {
      return
    }
    if (column > 0) {
      boardState[row][column - 1] = createEmptyKeyData()
      setColumn(column - 1)
    }
  }
  
  useEffect(() => {
    if (gameState === GameState.COMPLETE) {
      navigation.navigate('success')
    }
  })

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8
      }}
    >
      <WordBoard board={boardState}/>
      <Keyboard  keys={keyboardState} onKey={handleKey} onEnter={handleEnter} onDel={handleDel}/>
    </View>
  );
}

function checkWord(word: string, guess: Array<KeyData>) : Array<KeyData> {
  return guess.map((v, i) => {
    v.state = KeyState.INCORRECT
    if (word.split("").findIndex(s => v.character === s) >= 0 ) {
      v.state = KeyState.PARTIAL
    }
    if (word[i] === v.character) {
      v.state = KeyState.CORRECT
    }
    return v
  })
}

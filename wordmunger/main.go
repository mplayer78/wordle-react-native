package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
)

func main() {
	f, err := os.Open("words.txt")

	if err != nil {
		log.Fatal(err)
	}

	out, err := os.Create("words.json")
	if err != nil {
		log.Fatal(err)
	}

	s := bufio.NewScanner(f)
	s.Split(bufio.ScanLines)

	var alphanumeric = regexp.MustCompile("^[a-zA-Z]*$")
	fmt.Fprintf(out, "[")
	for s.Scan() {
		word := s.Text()
		if alphanumeric.MatchString(word) && len(word) == 5 {
			fmt.Fprintf(out, "\"%s\",", strings.ToLower(word))
		}
	}
	fmt.Fprintf(out, "]")
}

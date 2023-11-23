package main

import (
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	token := os.Getenv("DISCORD_TOKEN")
	if len(token) < 1 {
		log.Fatal("discord token cant be empty")
	}

	channelId := os.Getenv("CHANNEL_ID")
	if len(channelId) < 1 {
		log.Fatal(("channel id cant be empty"))
	}

	bot, err := NewBot(token, channelId)

	if err != nil {
		log.Fatal("cannot initialize bot, err:", err)
	}

	state := bot.discord.State.SessionID

	log.Printf("initialized bot with session %s", state)

	bot.sendMessage("hello world")
}

package main

import (
	"github.com/bwmarrin/discordgo"
	"github.com/pkg/errors"
)

type Bot struct {
	discord   *discordgo.Session
	channelId string
}

func NewBot(token, channelId string) (*Bot, error) {
	discord, err := discordgo.New("Bot " + token)

	if err != nil {
		return nil, err
	}

	discord.Identify.Intents = discordgo.IntentGuildMessages
	err = discord.Open()

	if err != nil {
		return nil, err
	}

	return &Bot{discord, channelId}, nil
}

func (bot *Bot) sendMessage(message string) error {
	_, err := bot.discord.ChannelMessageSend(bot.channelId, message)

	if err != nil {
		return errors.Unwrap(err)
	}

	return nil
}

package main

import (
	"crypto/sha256"
	"crypto/subtle"
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/dimfu/TU-leaderboard/bot/data"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	l := log.New(os.Stdout, "api", log.LstdFlags)

	apiKey := os.Getenv("API_KEY")
	if len(apiKey) < 1 {
		log.Fatal(("API key cant be empty"))
	}

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

	app := fiber.New()

	app.Use(keyauth.New(keyauth.Config{
		KeyLookup: "cookie:access_token",
		Validator: func(c *fiber.Ctx, key string) (bool, error) {
			hashedAPIKey := sha256.Sum256([]byte(apiKey))
			hashedKey := sha256.Sum256([]byte(key))

			if subtle.ConstantTimeCompare(hashedAPIKey[:], hashedKey[:]) == 1 {
				return true, nil
			}
			return false, keyauth.ErrMissingOrMalformedAPIKey
		},
	}))

	app.Post("/send-notification", sendNotificationHandler(bot))

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt)

	go func() {
		err := app.Listen(":3000")
		if err != nil {
			l.Fatal(err)
		}
	}()

	sig := <-sigChan
	l.Println("received terminate, graceful shutdown", sig)

	app.Shutdown()
}

func sendNotificationHandler(bot *Bot) fiber.Handler {
	return func(c *fiber.Ctx) error {
		dt := new(data.SendNotificationRequest)
		err := c.BodyParser(dt)
		if err != nil {
			err := c.Status(http.StatusInternalServerError).JSON(data.SendNotificationResponse{
				Message: err.Error(),
			})
			return err
		}

		err = bot.sendNotification(dt.Message)
		if err != nil {
			err := c.Status(http.StatusInternalServerError).JSON(data.SendNotificationResponse{
				Message: "failed to send notification",
			})
			return err
		}

		c.JSON(data.SendNotificationResponse{Message: "notification sent"})
		return nil
	}
}

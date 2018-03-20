defmodule TurboWeb.GamesChannel do
  use TurboWeb, :channel

  alias Turbo.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Turbo.GameBackup.load(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("playerCount", %{"playerCount" => ll, "id" => id}, socket) do
    game = Game.play(socket.assigns[:game], ll,id)
    Turbo.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("playerInfo", %{"playerInfo" => ll}, socket) do
    game = Game.playerInfo(socket.assigns[:game], ll)
    Turbo.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end

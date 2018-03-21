defmodule TurboWeb.GamesChannel do
  use TurboWeb, :channel

  alias Turbo.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      IO.puts("Available Games")
      IO.inspect(Turbo.GameBackup.list())
      # listgame = Turbo.GameBackup.list() || %{}
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
    old_game = Turbo.GameBackup.load(socket.assigns[:name]) || socket.assigns[:game]
    game = Game.play(old_game, ll,id)
    Turbo.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("playerActions", %{"keyCode" => keyCode,"id" => id}, socket) do
    old_game = Turbo.GameBackup.load(socket.assigns[:name])
    game = Game.setActions(old_game, keyCode,id)
    Turbo.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    broadcast socket, "playerActionsCompleted", game
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (games:lobby).
  # def handle_in("tellothers", payload, socket) do
  #   broadcast! socket, "tellothers", payload
  #   {:noreply, socket}
  # end

  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (games:lobby).
  # def handle_in("shout", payload, socket) do
  #   broadcast socket, "shout", payload
  #   {:noreply, socket}
  # end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end

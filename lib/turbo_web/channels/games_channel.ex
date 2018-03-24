defmodule TurboWeb.GamesChannel do
  use TurboWeb, :channel

  alias Turbo.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Turbo.GameBackup.load(name) || Game.new()
      Turbo.GameBackup.showlist()
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
    broadcast socket, "playerActionsCompleted", game
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

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end

defmodule Turbo.Game do
  def new do
    getDefaultState()
  end

  def getDefaultState() do
    %{
      playerOneInfo: [],
      playerTwoInfo: [],
      winner: 0,
      playerCount: 0
    }
  end

  def client_view(game) do
    %{
      playerOneInfo: game.playerOneInfo,
      playerTwoInfo: game.playerTwoInfo,
      playerCount: game.playerCount
    }
  end

  def play(game,ll) do
    game = Map.replace!(game, :playerCount ,ll)
      if(game.playerCount == 1) do
        game = Map.replace!(game, :playerOneInfo ,[50,720])

      else
        if (game.playerCount == 2) do
        game = Map.replace!(game, :playerTwoInfo ,[50,620])

      else
        IO.inspect("Observer")
      end
      end
      IO.inspect(game)
      game
    end
end

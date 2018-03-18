defmodule Turbo.Game do
  def new do
    getDefaultState()
  end

  def getDefaultState() do
    %{
      playerInfo: [[],[]],
      obstaclePosition: getObstacles(),
      playerOneInfo: [],
      playerTwoInfo: [],
      winner: 0,
      playerCount: 0
    }
  end

  def client_view(game) do
    %{
      obstaclePosition: game.obstaclePosition,
      playerInfo: game.playerInfo,
      playerOneInfo: game.playerOneInfo,
      playerTwoInfo: game.playerTwoInfo,
      playerCount: game.playerCount
    }
  end

  def play(game,ll) do
    game = Map.replace!(game, :playerCount ,ll)
      if(game.playerCount == 1) do
        game = Map.replace!(game, :playerInfo ,[[10,720]])

      else
        if (game.playerCount == 2) do
        game = Map.replace!(game, :playerInfo ,[[10,720],[10,620]])

      else
        IO.inspect("Observer")
      end
      end
      IO.inspect(game)
      game
    end

    def playerInfo(game,ll) do
      IO.inspect("before updating playerInfo")
      IO.inspect(game)
      game = Map.replace!(game, :playerInfo ,ll)
      IO.inspect("after updating playerInfo")
      IO.inspect(game)
      game
    end

    def getObstacles() do
      obs = [[[250,700],[500,600],[750,700],[1100,600]],[[250,600],[500,700],[850,600],
      [950,700]],[[250,700],[500,600],[750,700],[1100,600]],[[250,600],[500,700],[850,600],[950,700]]]
      |> Enum.random()
      IO.inspect obs
      obs
    end
end

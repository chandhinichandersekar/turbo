defmodule Turbo.Game do
  def new do
    getDefaultState()
  end

  def getDefaultState() do
    %{
      playerInfo: %{},
      obstaclePosition: getObstacles(),
      winner: 0,
      playerCount: 0
    }
  end

  def client_view(game) do
    %{
      obstaclePosition: game.obstaclePosition,
      playerInfo: game.playerInfo,
      playerCount: game.playerCount
    }
  end

  def play(game,ll,id) do
    game = Map.replace!(game, :playerCount ,ll)
    playerInfo_map = game[:playerInfo]
      if(id == 1) do
        playerInfo_map = Map.put(playerInfo_map,id,[10,720])
        game = Map.put(game,:playerInfo,playerInfo_map)
      else
        if (id == 2) do
        playerInfo_map = Map.put(playerInfo_map,id,[10,620])
        game = Map.put(game,:playerInfo,playerInfo_map)
      else
        IO.inspect("Observer")
      end
      end
      IO.inspect(game)
      game
    end

















    def playerInfo(game,ll) do
      # IO.inspect("before updating playerInfo")
      IO.inspect(game)
      game = Map.replace!(game, :playerInfo ,ll)
      # rangevalues = Enum.map(game.obstaclePosition,fn x -> Enum.at(x,0) end)
      # |> Enum.map(fn x -> Enum.to_list x-80 .. x+20 end)
      # |> List.flatten()
      # IO.inspect("range")
      # IO.inspect(rangevalues)
      # # obstacleYOffset = Enum.fetch!(,1)
      # IO.inspect(Enum.at(Enum.at(game.playerInfo,0),0))
      # if(Enum.member?(rangevalues, Enum.at(Enum.at(game.playerInfo,0),0))) do
      #   IO.inspect "hit"
      # #   # oldposx = Enum.at(Enum.at(game.playerInfo,0),0)
      # #   # IO.inspect "oldposx"
      # #   # IO.inspect oldposx
      # #   # oldposy = Enum.at(Enum.at(game.playerInfo,0),1)
      # #   # # newposx = Enum.at(Enum.at(game.playerInfo,0),0)
      # #   # # IO.inspect "newposx"
      # #   # # IO.inspect newposx
      # #   # #
      # #   # game = Map.replace!(game, :playerInfo ,[[oldposx-100,oldposy],Enum.at(game.playerInfo,1)])
      # #   # # # IO.inspect("after updating playerInfo")
      # #   IO.inspect(game)
      # end
      game
    end



    def getObstacles() do
      obs = [[[250,720],[500,620],[750,720],[1100,620]],[[250,620],[500,720],[850,620],
      [950,720]],[[250,720],[500,620],[750,720],[1100,620]],[[250,620],[500,720],[850,620],[950,720]]]
      |> Enum.random()
      IO.inspect obs
      obs
    end
end

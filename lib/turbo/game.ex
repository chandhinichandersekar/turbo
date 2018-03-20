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
    game = if(id == 1) do
        playerInfo_map = Map.put(playerInfo_map,id,[10,730])
        Map.put(game,:playerInfo,playerInfo_map)
      else
        if (id == 2) do
        playerInfo_map = Map.put(playerInfo_map,id,[10,630])
        Map.put(game,:playerInfo,playerInfo_map)
      else
        game
      end
      end
      game
    end


    def setActions(game,keyCode,id) do
      playerInfo_map = game[:playerInfo]
      game = case{keyCode} do
        {37} -> [x,y] = playerInfo_map[id]
                x = x - 30
                playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                Map.put(game,:playerInfo,playerInfo_map)
        {38} -> [x,y] = playerInfo_map[id]
                y = y - 30
                playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                Map.put(game,:playerInfo,playerInfo_map)
        {39} ->  [x,y] = playerInfo_map[id]
                x = x + 30
                playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                Map.put(game,:playerInfo,playerInfo_map)
        {40} -> [x,y] = playerInfo_map[id]
                y = y + 30
                playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                Map.put(game,:playerInfo,playerInfo_map)
        _ -> game
      end

      # IO.inspect("before updating playerInfo")
      # IO.inspect(game)
      #game = Map.replace!(game, :playerInfo ,ll)
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
      obs = [[[250,710],[500,620],[750,710],[1100,620]],[[250,620],[500,710],[850,620],
      [950,710]],[[250,710],[500,620],[750,710],[1100,620]],[[250,620],[500,710],[850,620],[950,710]]]
      |> Enum.random()
      IO.inspect obs
      obs
    end
end

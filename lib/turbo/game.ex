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

      [x,y] = playerInfo_map[id]
      obstaclelist = Enum.map(game.obstaclePosition,&getObstacleRange/1)
      hitObstacle = Enum.map(obstaclelist,
      fn hit ->
        if(Enum.member?(Enum.at(Enum.at(hit,0),0), x) && Enum.member?(Enum.at(Enum.at(hit,1),0), y )) do
           IO.inspect hit
          true
        else
          false
        end
      end)
      if Enum.any?(hitObstacle) do
         x = x - 100
         playerInfo_map = Map.put(playerInfo_map,id,[x,y])
         game = Map.put(game,:playerInfo,playerInfo_map)
         hitObstacle = []
       else
       end
      game
    end

    def getObstacleRange(obs) do
      [x,y] = obs
      xrangevalues = Enum.to_list x-50 .. x+20
      yrangevalues =  Enum.to_list y-10 .. y+40
      rangeValues = [[xrangevalues],[yrangevalues]]
    end


    def getObstacles() do
      obs = [[[250,710],[500,620],[750,710],[1100,620]],[[250,620],[500,710],[850,620],
      [950,710]],[[250,710],[500,620],[750,710],[1100,620]],[[250,620],[500,710],[850,620],[950,710]]]
      |> Enum.random()
      obs
    end
end

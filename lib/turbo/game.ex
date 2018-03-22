defmodule Turbo.Game do
  def new do
    getDefaultState()
  end

  def getDefaultState() do
    %{
      playerInfo: %{},
      obstaclePosition: getObstacles(),
      winner: 0,
      playerCount: 0,
      finishPosition: [[1280,630]],
      wait: 0,
      crashed: []
    }
  end

  def client_view(game) do
    %{
      obstaclePosition: game.obstaclePosition,
      finishPosition: game.finishPosition,
      playerInfo: game.playerInfo,
      winner: game.winner,
      playerCount: game.playerCount,
      wait: game.wait,
      crashed: game.crashed
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
      if (game.playerCount >= 2) do
        game = Map.put(game,:wait,0)
        game = case{keyCode} do
          {37} -> [x,y] = playerInfo_map[id]
                  x = if(x - 30 > 10)do
                    x = x - 30
                  else
                    x
                  end
                  playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                  game = checkCarCollision(game,x,y,id)
                  Map.put(game,:playerInfo,playerInfo_map)
          {38} -> [x,y] = playerInfo_map[id]
                  y = if(y - 30 > 590)do
                    y = y - 30
                  else
                    y
                  end
                  playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                  game = checkCarCollision(game,x,y,id)
                  Map.put(game,:playerInfo,playerInfo_map)
          {39} ->  [x,y] = playerInfo_map[id]
                    x = if(x + 30 < 1340)do
                      x = x + 30
                    else
                      x
                    end
                  playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                  game = checkFinish(game,x,y,id)
                  game = checkCarCollision(game,x,y,id)
                  Map.put(game,:playerInfo,playerInfo_map)
          {40} -> [x,y] = playerInfo_map[id]
                  y = if(y + 30 < 790)do
                    y = y + 30
                  else
                    y
                  end
                  playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                  game = checkCarCollision(game,x,y,id)
                  Map.put(game,:playerInfo,playerInfo_map)
          _ -> game
      end
    else
      game = Map.put(game,:wait,1)
end
      [x,y] = playerInfo_map[id]
      obstaclelist = Enum.map(game.obstaclePosition,&getObstacleRange/1)
      hitObstacle = Enum.map(obstaclelist,
      fn hit ->
        if(Enum.member?(Enum.at(Enum.at(hit,0),0), x) && Enum.member?(Enum.at(Enum.at(hit,1),0), y )) do
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

    def getCarRange(car) do
      [x,y] = car
      xrangevalues =  x-50 .. x+20
      yrangevalues =   y-20 .. y+20
      rangeValues = [[xrangevalues],[yrangevalues]]
    end


    def getObstacles() do
      obs = [[[250,710],[500,620],[750,710],[1100,620]],[[250,620],[500,710],[850,620],
      [950,710]],[[250,710],[500,620],[750,710],[1100,620]],[[250,620],[500,710],[850,620],[950,710]]]
      |> Enum.random()
      obs
    end

    def checkFinish(game,x,y,id) do
      finishRange = getObstacleRange(Enum.at(game.finishPosition,0))
      if (Enum.member?(Enum.at(Enum.at(finishRange,0),0), x)) do
        game = Map.put(game,:winner,id)
      else
        game
      end
    end

    def checkCarCollision(game,x,y,id) do
      playerInfo = game[:playerInfo]
      if id==1 do
        othercar = playerInfo[2]
      else
        othercar = playerInfo[1]
      end
      IO.inspect othercar
      otherCarRange = getCarRange(othercar)
      if(Enum.member?(Enum.at(Enum.at(otherCarRange,0),0), x) && Enum.member?(Enum.at(Enum.at(otherCarRange,1),0), y ) ) do
        game = Map.put(game,:crashed, [x,y])
      else
        game
      end
    end
end

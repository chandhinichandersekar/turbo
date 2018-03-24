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
    playerOneStartPosition = [10,730]
    playerTwoStartPosition = [10,630]
    #IO.inspect game
    game = if(id == 1) do
        playerInfo_map = Map.put(playerInfo_map,id,playerOneStartPosition)
        Map.put(game,:playerInfo,playerInfo_map)
      else
        if (id == 2) do
        playerInfo_map = Map.put(playerInfo_map,id,playerTwoStartPosition)
        game = Map.put(game,:wait,0)
        Map.put(game,:playerInfo,playerInfo_map)
      else
        game
      end
      end
      game
    end


    def setActions(game,keyCode,id) do
      playerInfo_map = game[:playerInfo]
      changeValue = 30
      ychangeValue = 25
      xstartValue = 10
      ystartValue = 590
      xendValue = 1340
      yendValue = 760
      firstIndex = 1
      secondIndex = 2
      zeroIndex = 0
      IO.inspect game.crashed
      if (game.playerCount >= secondIndex && length(game.crashed) == zeroIndex) do
        game = Map.put(game,:wait,zeroIndex)
        game = case{keyCode} do
          {37} -> [x,y] = playerInfo_map[id]
                  x = if(x - changeValue > xstartValue)do
                    x = x - changeValue
                  else
                    x
                  end
                  playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                  game = checkCarCollision(game,x,y,id)
                  Map.put(game,:playerInfo,playerInfo_map)
          {38} -> [x,y] = playerInfo_map[id]
                  y = if(y - changeValue > ystartValue)do
                    y = y - changeValue
                  else
                    y
                  end
                  playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                  game = checkCarCollision(game,x,y,id)
                  Map.put(game,:playerInfo,playerInfo_map)
          {39} ->  [x,y] = playerInfo_map[id]
                    x = if(x + changeValue < xendValue)do
                      x = x + changeValue
                    else
                      x
                    end
                  playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                  game = checkFinish(game,x,y,id)
                  game = checkCarCollision(game,x,y,id)
                  Map.put(game,:playerInfo,playerInfo_map)
          {40} -> [x,y] = playerInfo_map[id]
                  y = if(y + changeValue < yendValue)do
                    y = y + ychangeValue
                  else
                    y
                  end
                  playerInfo_map = Map.put(playerInfo_map,id,[x,y])
                  game = checkCarCollision(game,x,y,id)
                  Map.put(game,:playerInfo,playerInfo_map)
          _ -> game
      end
    else
      if(length(game.crashed) == zeroIndex) do
      game = Map.put(game,:wait,firstIndex)
    end
end
      [x,y] = playerInfo_map[id]
      obstaclelist = Enum.map(game.obstaclePosition,&getObstacleRange/1)
      hitObstacle = Enum.map(obstaclelist,
      fn hit ->
        if(Enum.member?(Enum.at(Enum.at(hit,zeroIndex),zeroIndex), x) && Enum.member?(Enum.at(Enum.at(hit,firstIndex),zeroIndex), y )) do
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
      buffer1 = 50
      buffer2 =20
      xrangevalues = Enum.to_list x-buffer1 .. x+buffer2
      yrangevalues =  Enum.to_list y-buffer2 .. y+buffer1
      rangeValues = [[xrangevalues],[yrangevalues]]
    end

    def getFinishRange(obs) do
      [x,y] = obs
      buffer1 = 40
      buffer2 = 20
      buffer3 = 10
      xrangevalues = Enum.to_list x .. x+buffer2
      yrangevalues =  Enum.to_list y-buffer3 .. y+buffer1
      rangeValues = [[xrangevalues],[yrangevalues]]
    end

    def getCarRange(car) do
      [x,y] = car
      buffer1 = 50
      buffer2 =20
      xrangevalues =  x-buffer1 .. x+buffer2
      yrangevalues =   y-buffer2 .. y+buffer2
      rangeValues = [[xrangevalues],[yrangevalues]]
    end


    def getObstacles() do
      obs = [[[250,700],[500,620],[750,700],[1100,620]],[[250,620],[500,700],[850,620],
      [950,700]],[[250,700],[500,620],[750,700],[1100,620]],[[250,620],[500,700],[850,620],[950,700]]]
      |> Enum.random()
      obs
    end

    def checkFinish(game,x,y,id) do
      zeroIndex = 0
      finishRange = getFinishRange(Enum.at(game.finishPosition,zeroIndex))
      if (Enum.member?(Enum.at(Enum.at(finishRange,zeroIndex),zeroIndex), x)) do
        game = Map.put(game,:winner,id)
      else
        game
      end
    end

    def checkCarCollision(game,x,y,id) do
      zeroIndex = 0
      firstIndex = 1
      secondIndex = 2
      playerInfo = game[:playerInfo]
      if id==firstIndex do
        othercar = playerInfo[2]
      else
        othercar = playerInfo[1]
      end
      otherCarRange = getCarRange(othercar)
      if(Enum.member?(Enum.at(Enum.at(otherCarRange,zeroIndex),zeroIndex), x)
       && Enum.member?(Enum.at(Enum.at(otherCarRange,firstIndex),zeroIndex), y ) ) do
        game = if id==firstIndex do
          Map.put(game,:winner,secondIndex)
        else
          Map.put(game,:winner,firstIndex)
        end
        game = Map.put(game,:crashed, [x,y])
      else
        game
      end
    end
end

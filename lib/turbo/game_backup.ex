#learnt the concepts of agent from professor Nat Tuck's Hangman game
defmodule Turbo.GameBackup do
  use Agent

  def start_link do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def save(name, game) do
    Agent.update __MODULE__, fn state ->
      Map.put(state, name, game)
    end
  end

  def load(name) do
    Agent.get __MODULE__, fn state ->
      Map.get(state, name)
    end
  end

  def showlist() do
    Agent.get __MODULE__, fn state ->
      Enum.map(state, fn {key, val} -> if(Map.get(val,:finished) == false) do
         key
         end
       end)
    end
  end
end


# References:
# Class Notes
# http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/notes/10-proc-state/
# https://hexdocs.pm/elixir/Enum.html
# https://elixir-lang.org/

{
  pkgs ? import (fetchGit {
    url = https://github.com/NixOS/nixpkgs-channels;
    ref = "3590ff2d4c64711a194e3f18fc5c140e7dfa25df";
  }) {},
  ruby ? pkgs.ruby_2_3,
  bundler ? pkgs.bundler.override { inherit ruby; }

}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    ruby
    bundler
    postgresql_9_6
    parallel
  ];

  shellHook = ''
    mkdir -p .local-data/gems
    export GEM_HOME=$PWD/.local-data/gems
    export GEM_PATH=$GEM_HOME

    mkdir -p .local-data/postgresql/{sockets,data}
    unset PGHOST
    export PGHOST="$PWD/.local-data/postgresql/sockets"
    unset PGDATA
    export PGDATA="$PWD/.local-data/postgresql/data"

    if [ -z "$(ls -A $PGDATA)" ]; then
      initdb -D $PGDATA
    fi

    export PATH="$GEM_PATH/bin:$PATH"
  '';
}

let
  pkgs = import (
    fetchTarball {
      url = https://github.com/nixos/nixpkgs-channels/archive/3590ff2d4c64711a194e3f18fc5c140e7dfa25df.tar.gz;
      sha256 = "0gzbxlm0kp1l8qms0hb1y1ddzza3dyj16m87y4v9lv2kz71rh404";
    }
  ) {};
in
  pkgs.stdenv.mkDerivation {
    name = "environment";
    src = null;
    buildInputs = [
      pkgs.ruby_2_3.devEnv
      pkgs.postgresql_9_6
    ];
    shellHook = ''
      chruby_reset

      mkdir -p .nix-gems
      export GEM_HOME=$PWD/.nix-gems
      export GEM_PATH=$GEM_HOME

      echo "Welcome to your MARBLERUN Environment"
    '';
  }

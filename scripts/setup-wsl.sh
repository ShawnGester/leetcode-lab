#!/usr/bin/env bash
# Set up Ubuntu on WSL as a local dev environment for LeetLab (and Java/Node work in general).
# Safe to re-run: every step checks what is already installed first.
#
# Usage:
#   bash scripts/setup-wsl.sh [--maven] [--gradle] [--node-version 22] [--allow-windows-path]
#
# Refuses to run from a Windows drive (/mnt/c/...): clone the project into your Ubuntu home.
#
# Optional environment variables:
#   GIT_NAME="Your Name" GIT_EMAIL="you@example.com"  set global git identity if not already set

set -euo pipefail

NODE_VERSION="22"
NVM_VERSION="v0.40.3"
WITH_MAVEN=0
WITH_GRADLE=0
ALLOW_WINDOWS_PATH=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --allow-windows-path) ALLOW_WINDOWS_PATH=1 ;;
    --maven) WITH_MAVEN=1 ;;
    --gradle) WITH_GRADLE=1 ;;
    --node-version) NODE_VERSION="${2:?--node-version needs a value}"; shift ;;
    -h|--help) awk 'NR > 1 && /^#/ { sub(/^# ?/, ""); print; next } NR > 1 { exit }' "$0"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done

bold() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
ok() { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }

case "$(uname -s)" in
  Linux) ;;
  MINGW*|MSYS*|CYGWIN*)
    echo "ERROR: This is a Windows shell ($(uname -s), e.g. Git Bash), not WSL." >&2
    echo "Open Ubuntu (Start menu > Ubuntu, or run 'wsl' in PowerShell) and run the script there." >&2
    exit 1 ;;
  *)
    echo "ERROR: Unsupported OS '$(uname -s)'. This script is for Ubuntu on WSL (or Ubuntu Linux)." >&2
    exit 1 ;;
esac

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

if [[ $EUID -eq 0 ]]; then
  echo "Run this as your normal WSL user (it uses sudo when needed), not as root." >&2
  exit 1
fi

bold "Checking platform"
if [[ -n "${WSL_DISTRO_NAME:-}" ]] || grep -qiE "microsoft|wsl" /proc/version 2>/dev/null; then
  ok "Running inside WSL (${WSL_DISTRO_NAME:-distro name unknown})"
else
  warn "This is Linux but not WSL. Continuing, since the script also works on regular Ubuntu."
fi
if [[ -r /etc/os-release ]]; then
  # shellcheck disable=SC1091
  . /etc/os-release
  ok "Distro: ${PRETTY_NAME:-unknown}"
  [[ "${ID:-}" == "ubuntu" ]] || warn "Expected Ubuntu; apt package names may differ"
fi

windows_path=""
for p in "$(pwd -P)" "$SCRIPT_DIR"; do
  [[ "$p" == /mnt/* ]] && { windows_path="$p"; break; }
done
if [[ -n "$windows_path" ]]; then
  if [[ $ALLOW_WINDOWS_PATH -eq 1 ]]; then
    warn "Running from $windows_path on a Windows drive because --allow-windows-path was given."
  else
    cat >&2 <<EOF

ERROR: $windows_path is on a Windows drive (/mnt/... is how WSL shows C:, D:, ...).
LeetLab must live inside WSL Ubuntu, not on Windows: npm installs, file watching,
and javac are much slower or flaky on /mnt/*, and Windows tools can rewrite line endings.

Clone it into your Ubuntu home folder instead, from a WSL terminal:

    mkdir -p ~/repositories/dev && cd ~/repositories/dev
    origin repo clone shawn-ge/leetcode-lab
    cd leetcode-lab && pwd          # should print /home/<you>/repositories/dev/leetcode-lab
    bash scripts/setup-wsl.sh

To run from a Windows drive anyway (not recommended), pass --allow-windows-path.
EOF
    exit 1
  fi
fi

apt_missing=()
need_pkg() { dpkg -s "$1" >/dev/null 2>&1 || apt_missing+=("$1"); }

bold "System packages"
for pkg in build-essential git curl wget unzip zip ca-certificates; do need_pkg "$pkg"; done
if ! command -v javac >/dev/null 2>&1 || ! javac -version 2>&1 | grep -qE 'javac (2[1-9]|[3-9][0-9])'; then
  need_pkg openjdk-21-jdk
fi
[[ $WITH_MAVEN -eq 1 ]] && need_pkg maven

if [[ ${#apt_missing[@]} -gt 0 ]]; then
  echo "  Installing: ${apt_missing[*]}"
  sudo apt-get update -y
  if ! sudo apt-get install -y "${apt_missing[@]}"; then
    echo "apt install failed. If openjdk-21-jdk is unavailable (Ubuntu 20.04 or older), upgrade to 22.04+ or install Temurin 21 from https://adoptium.net." >&2
    exit 1
  fi
else
  ok "All apt packages already installed"
fi

bold "Java"
JAVA_HOME_DIR="$(find /usr/lib/jvm -maxdepth 1 -name 'java-21-openjdk-*' -type d 2>/dev/null | head -n1)"
if [[ -z "$JAVA_HOME_DIR" ]]; then
  JAVA_HOME_DIR="$(dirname "$(dirname "$(readlink -f "$(command -v javac)")")")"
fi
if ! grep -q "# >>> leetlab java >>>" "$HOME/.bashrc" 2>/dev/null; then
  cat >> "$HOME/.bashrc" <<EOF

# >>> leetlab java >>>
export JAVA_HOME="$JAVA_HOME_DIR"
export PATH="\$JAVA_HOME/bin:\$PATH"
# <<< leetlab java <<<
EOF
  ok "Added JAVA_HOME=$JAVA_HOME_DIR to ~/.bashrc"
else
  ok "JAVA_HOME already configured in ~/.bashrc"
fi
export JAVA_HOME="$JAVA_HOME_DIR"

bold "Node.js $NODE_VERSION via nvm"
export NVM_DIR="$HOME/.nvm"
if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
  curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash
else
  ok "nvm already installed"
fi
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
if nvm ls "$NODE_VERSION" >/dev/null 2>&1; then
  ok "Node $NODE_VERSION already installed"
else
  nvm install "$NODE_VERSION"
fi
nvm alias default "$NODE_VERSION" >/dev/null
nvm use default >/dev/null

if [[ $WITH_GRADLE -eq 1 ]]; then
  bold "Gradle via SDKMAN"
  export SDKMAN_DIR="$HOME/.sdkman"
  if [[ ! -s "$SDKMAN_DIR/bin/sdkman-init.sh" ]]; then
    curl -fsSL "https://get.sdkman.io?rcupdate=true" | bash
  fi
  set +u
  # shellcheck disable=SC1091
  . "$SDKMAN_DIR/bin/sdkman-init.sh"
  if command -v gradle >/dev/null 2>&1; then
    ok "Gradle already installed"
  else
    sdk install gradle </dev/null
  fi
  set -u
fi

bold "Git"
if [[ -n "${GIT_NAME:-}" && -z "$(git config --global user.name || true)" ]]; then
  git config --global user.name "$GIT_NAME"
fi
if [[ -n "${GIT_EMAIL:-}" && -z "$(git config --global user.email || true)" ]]; then
  git config --global user.email "$GIT_EMAIL"
fi
[[ -n "$(git config --global init.defaultBranch || true)" ]] || git config --global init.defaultBranch main
[[ -n "$(git config --global core.autocrlf || true)" ]] || git config --global core.autocrlf input
if [[ -z "$(git config --global user.name || true)" || -z "$(git config --global user.email || true)" ]]; then
  warn "git identity not set. Run: git config --global user.name \"Your Name\" && git config --global user.email you@example.com"
else
  ok "git identity: $(git config --global user.name) <$(git config --global user.email)>"
fi

bold "Installed versions"
printf '  %-8s %s\n' git "$(git --version | awk '{print $3}')"
printf '  %-8s %s\n' gcc "$(gcc -dumpfullversion 2>/dev/null || gcc -dumpversion)"
printf '  %-8s %s\n' java "$(java -version 2>&1 | head -n1)"
printf '  %-8s %s\n' javac "$(javac -version 2>&1)"
printf '  %-8s %s\n' node "$(node --version)"
printf '  %-8s %s\n' npm "$(npm --version)"
command -v mvn >/dev/null 2>&1 && printf '  %-8s %s\n' maven "$(mvn -B -v 2>/dev/null | head -n1)"
command -v gradle >/dev/null 2>&1 && printf '  %-8s %s\n' gradle "$(gradle --version 2>/dev/null | grep -m1 -E '^Gradle [0-9]')"

node_major="$(node --version | sed -E 's/^v([0-9]+).*/\1/')"
(( node_major >= 20 )) || { echo "Node $node_major is too old; need 20+." >&2; exit 1; }

cat <<'EOF'

All set. Next steps:
  1. Open a new terminal (or run: source ~/.bashrc) so JAVA_HOME and nvm are on PATH.
  2. If you haven't yet, clone the project into your Ubuntu home (not /mnt/c):
       curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
       origin auth login
       mkdir -p ~/repositories/dev && cd ~/repositories/dev
       origin repo clone shawn-ge/leetcode-lab && cd leetcode-lab
       git checkout cursor/leetcode-practice-3908
  3. Install dependencies once while online (afterwards the app runs fully offline):
       npm install
  4. Start the app and open http://127.0.0.1:4317 in your Windows browser:
       npm run dev
  5. Open the folder in VS Code / Cursor over WSL: run `code .` or `cursor .` from the project folder.
EOF

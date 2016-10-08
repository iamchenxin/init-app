###-begin-cmts.js-completions-###
#
# yargs command completion script
#
# Installation: ./cmts.js completion >> ~/.bashrc
#    or ./cmts.js completion >> ~/.bash_profile on OSX.
#
_yargs_completions()
{
    local cur_word args type_list

    cur_word="${COMP_WORDS[COMP_CWORD]}"
    args=("${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$(./cmts.js --get-yargs-completions "${args[@]}")

    COMPREPLY=( $(compgen -W "${type_list}" -- ${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ ${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=( $(compgen -f -- "${cur_word}" ) )
    fi

    return 0
}
echo 'aaaa'
complete -F _yargs_completions ./index.js
###-end-cmts.js-completions-###

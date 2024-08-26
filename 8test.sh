#!/bin/bash

# Function to generate permutations
permute() {
    local prefix="$1"
    local str="$2"

    if [ -z "$str" ]; then
        echo "$prefix"
    else
        local i
        for ((i=0; i<${#str}; i++)); do
            local new_prefix="${prefix}${str:i:1} "
            local new_str="${str:0:i}${str:i+1}"
            permute "$new_prefix" "$new_str"
        done
    fi
}

# Generate a string of numbers from 0 to 8
numbers=$(seq -s '' 0 8)

# Generate permutations of numbers
permute "" "$numbers" | while read -r permutation; do
    echo "3 $permutation" | ./n-puzzle
done

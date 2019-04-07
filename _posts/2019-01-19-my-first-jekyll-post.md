---
layout: single
title:  "My First Jekyll Post"
categories: [blog]
tags: [github, jekyll, testing]
toc: true
toc_label: "My First Post"
toc_icon: "smile-beam"  # corresponding Font Awesome icon name (without fa prefix)
toc_sticky: true
---
# Hello World! 
This is my first [Jekyll](https://jekyllrb.com/) post hosted by [Github Pages](https://pages.github.com/). The theme I use is [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/), by [Michael Rose](https://twitter.com/mmistakes).

## Preferred Coding IDE
I primarily use VS Code on Windows 10 for all coding projects. As an early adopter, the software is only getting better with time. There are a lot of great [Videos](https://code.visualstudio.com/docs/getstarted/introvideos#VSCode) that demonstrate proper setup and an overview of the features. 

<img src="{{ site.url }}{{ site.baseurl }}/assets/images/vscode_scheme.JPG" alt="Visual Studio Code with Hack and One Dark Pro Vivid Theme">
<figcaption>My preferred font is Hack with a One Dark Pro Vivid Theme.</figcaption>

### My Favorite Feature
One of my favorite features included with VS Code is the integrate Version Control. It makes using Git seemless and is a powerful feature. I'm really only telling you this because I want to make the post a bit longer so I can see what it looks like.

### Thanks
Thanks for stopping by! The rest of this post is me messing around with Jekyll and the Theme.

# Content Flow
This following is filler text. It will be removed in the future once I am happy with my blog configuration.

[Lorem Ipsum Gangsta Text Generator](http://lorizzle.nl/?feed=1) for those interested where I got the below:

## Pot ipsum shizzlin dizzle

Pot ipsum shizzlin dizzle sit mah nizzle, gangsta adipiscing elit. Nullam rizzle velizzle, yippiyo volutpat, shizzle my nizzle crocodizzle that's the shizzle, gravida vel, uhuh ... yih!. Fo shizzle mah nizzle fo rizzle, mah home g-dizzle you son of a bizzle tortizzle. Own yo' eros. Crackalackin bling bling dolor dapibus its fo rizzle tempizzle hizzle. 

### Crazy dapibizzle

Crazy dapibizzle. Curabitur tellus break yo neck, yall, pretium rizzle, mattizzle get down get down, eleifend vitae, nunc. Gangsta ante my shizz primizzle nizzle faucibizzle shiznit gizzle izzle ultricizzle gizzle cubilia Crackalackin; Sizzle vitae break it down dizzle brizzle daahng dawg aliquizzle. Phasellizzle gangsta owned. 

#Code Block Test
Below is what code blocks look like using this theme.

## Testing Tiny Code Blocks
```python
x = "Coding while using VS Code with an absurd amount of "
y = "customizations and extensions is fun."
print (x + y)
```

## Testing Larger Blocks of Code (Dice.py)
```python
import random

def dice_roll():
    while True:
        print("Your number is: " + str(random.randint(1, 6)))
        play_again = input("Would you like to play again? ")
        while play_again != 'yes':
            if play_again == 'no':
                return print("Game Over")
            else:
                print("Input not recognized")
                play_again = input("Would you like to play again? ")

def main():
    game_start = input("Would you like to roll the dice? ")
    if game_start == 'yes':
        dice_roll()
    else:
        print('too bad')

if __name__ == '__main__':
    main()
```
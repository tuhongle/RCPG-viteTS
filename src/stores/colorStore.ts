import { ref } from "vue";
import { defineStore } from "pinia";

export const useColorStore = defineStore('color', () => {
    const colors = ref<string[]>([]);
    const lockedColors = ref<string[]>([]);
    const isLocked = ref<string>('');
    const showLockedAlert = ref<boolean>(false);
    const colorLocked = ref<string>('');
    const colorCopied = ref<boolean>(false);

    let colorsNum = 5;

    const text = 'ABCDEF0123456789';

    const createRandomColor = () => {
        let result = '#';
        for (let i=0; i<6; i++) {
            const j = Math.floor(Math.random() * (text.length - 1));
            result += text[j];
        };
        return result;
    };

    const createColorPalette = () => {
        colorCopied.value = false;
        for (let i=0; i<colorsNum; i++) {
            if (lockedColors.value[i]) {
                colors.value[i] = lockedColors.value[i];
            } else {
                colors.value[i] = createRandomColor();
            }
        }
    }

    

    createColorPalette();

    const addColor = () => {
        colorsNum ++;
        colors.value.push(createRandomColor());
    }

    const removeColor = () => {
        colorsNum --;
        colors.value.pop();
    }

    const lockColor = (el : MouseEvent, data: string, i: number) => {
        const nodes = (el.target as HTMLElement).childNodes;
        showLockedAlert.value = true;
        colorLocked.value = data;
        if ((nodes[0] as HTMLElement).classList.contains('unlocked')) {
            (nodes[0] as HTMLElement).style.display = 'none';
            (nodes[1] as HTMLElement).style.display = 'block';
            (nodes[0] as HTMLElement).classList.remove('unlocked');
            document.getElementById(`color${data.substring(1)}`)!.style.backgroundColor = '#FF0000';
            isLocked.value = 'locked';
            lockedColors.value[i] = data;
        } else {
            (nodes[0] as HTMLElement).style.display = 'block';
            (nodes[1] as HTMLElement).style.display = 'none';
            (nodes[0] as HTMLElement).classList.add('unlocked');
            document.getElementById(`color${data.substring(1)}`)!.style.backgroundColor = '#F8F8F8';
            isLocked.value = 'unlocked';
            lockedColors.value[i] = '';
        };
        setTimeout(() => {
            showLockedAlert.value = false;
        }, 2000);
    };

    return { colors, isLocked, showLockedAlert, colorLocked, colorCopied
            , createColorPalette, addColor, removeColor, lockColor }
})
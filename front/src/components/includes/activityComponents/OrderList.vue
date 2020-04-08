<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6"
                 style="display: flex; flex-direction: column; justify-content: center">
                <h3>Remets dans l’ordre les étapes du lavage des mains</h3>
            </div>
            <div class="col-md-6" style="border-left: solid 1px lightgray">
                <draggable v-model="list" class="mb-5" ghost-class="ghost" :sort="true">
                    <transition-group>
                        <div v-for="element in list" :key="element" class="mb-3 cursor">
                            {{element}}
                        </div>
                    </transition-group>
                </draggable>
            </div>
            <div class="col-6" style="text-align: right">
                <button class="btn btn-success" style="width: 80%" @click="submit()">Valider</button>
            </div>
        </div>
    </div>
</template>

<script>

    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable
        },
        data(){
            return{
                list: []
            }
        },
        props:{
            listResponse: {
                type: Array
            },
        changeEntryState: {
                type: Function
            },
        entryId: {
                type: Number
            },
        },
        mounted() {
            this.list = this.listResponse
        },
        methods: {
            submit() {
                console.log("Not Implemented");
                this.changeEntryState(this.entryId, "finished")
                return {};
            }
        },
        name: "OrderList"
    }
</script>


<style scoped>
    .draggable {
        border: solid;
    }

    .cursor {
        cursor: grab;
        border-bottom: solid 1px lightgray;
    }

    .ghost {
        color: #0077b3;
        cursor: grabbing;
    }

</style>